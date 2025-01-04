data "dotenv" "this" {
  filename = "${path.module}/../.env"
}

data "cloudflare_zone" "this" {
  zone_id = var.ZONE_ID
}

data "cloudflare_api_token_permission_groups" "all" {

}
