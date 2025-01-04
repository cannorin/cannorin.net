locals {
  name       = replace(var.REPOSITORY_NAME, ".", "-")
  account_id = data.dotenv.this.entries.CLOUDFLARE_ACCOUNT_ID
  web_domain = "www.${var.BASE_DOMAIN}"
}
