terraform {
  required_version = ">= 1.9"

  backend "s3" {
    region = "auto"

    # Set these properties with `terraform.tfbackend`:
    // bucket     = "tfstate"
    // key        = "xxxxxxx.tfstate"
    // access_key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    // secret_key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    // endpoints  = { s3 = "https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.cloudflarestorage.com" }

    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    use_path_style              = true
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }

    dotenv = {
      source  = "germanbrew/dotenv"
      version = "~> 1.1.3"
    }
  }
}
