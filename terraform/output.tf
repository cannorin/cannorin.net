output "PUBLIC_WEB_TURNSTILE_SITEKEY" {
  value = cloudflare_turnstile_widget.web.id
}

output "PUBLIC_WEB_DOMAIN" {
  value = local.web_domain
}

output "WEB_TURNSTILE_SECRET_KEY" {
  value     = cloudflare_turnstile_widget.web.secret
  sensitive = true
}
