resource "cloudflare_pages_project" "web" {
  account_id        = data.dotenv.this.entries.CLOUDFLARE_ACCOUNT_ID
  name              = local.name
  production_branch = "main"

  source {
    type = "github"
    config {
      owner               = var.REPOSITORY_OWNER
      repo_name           = var.REPOSITORY_NAME
      production_branch   = "main"
      pr_comments_enabled = true
      deployments_enabled = true
    }
  }

  build_config {
    build_command   = "yarn build"
    root_dir        = "apps/web"
    destination_dir = ".svelte-kit/cloudflare"
    build_caching   = true
  }

  deployment_configs {
    preview {
      environment_variables = {
        PUBLIC_WEB_DOMAIN            = local.web_domain
        PUBLIC_WEB_TURNSTILE_SITEKEY = cloudflare_turnstile_widget.web.id
      }
      secrets = {
        WEB_TURNSTILE_SECRET_KEY = cloudflare_turnstile_widget.web.secret
      }
      compatibility_date  = "2024-09-18"
      compatibility_flags = ["nodejs_compat"]
    }

    production {
      environment_variables = {
        PUBLIC_WEB_DOMAIN            = local.web_domain
        PUBLIC_WEB_TURNSTILE_SITEKEY = cloudflare_turnstile_widget.web.id
      }
      secrets = {
        WEB_TURNSTILE_SECRET_KEY = cloudflare_turnstile_widget.web.secret
      }
      compatibility_date  = "2024-09-18"
      compatibility_flags = ["nodejs_compat"]
    }
  }
}

resource "cloudflare_pages_domain" "web" {
  account_id   = data.dotenv.this.entries.CLOUDFLARE_ACCOUNT_ID
  project_name = cloudflare_pages_project.web.name
  domain       = local.web_domain
}

resource "cloudflare_record" "web" {
  zone_id = data.cloudflare_zone.this.zone_id
  name    = local.web_domain
  type    = "CNAME"
  content = cloudflare_pages_project.web.subdomain
  ttl     = 1
  proxied = true
}

resource "cloudflare_turnstile_widget" "web" {
  account_id = data.dotenv.this.entries.CLOUDFLARE_ACCOUNT_ID
  name       = "Widget for ${local.name}"
  domains    = [local.web_domain]
  mode       = "managed"
}

resource "cloudflare_workers_script" "redirect" {
  account_id = data.dotenv.this.entries.CLOUDFLARE_ACCOUNT_ID
  name       = "redirect-${local.name}"
  module     = true
  content    = <<EOF
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Check if the hostname is the apex domain
    if (url.hostname === '${var.BASE_DOMAIN}') {
      // Redirect to www subdomain with a 301 status
      url.hostname = '${local.web_domain}';
      return Response.redirect(url.toString(), 301);
    }

    // If it's not the apex domain, just proceed with the original request
    return fetch(request);
  },
};
EOF
}

resource "cloudflare_workers_domain" "redirect" {
  account_id = data.dotenv.this.entries.CLOUDFLARE_ACCOUNT_ID
  hostname   = var.BASE_DOMAIN
  service    = cloudflare_workers_script.redirect.name
  zone_id    = data.cloudflare_zone.this.zone_id
}
