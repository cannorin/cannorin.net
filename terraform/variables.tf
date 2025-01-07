variable "REPOSITORY_NAME" {
  description = "Name of the GitHub repository"
  type        = string
}

variable "REPOSITORY_OWNER" {
  description = "Owner of the GitHub repository"
  type        = string
}

variable "BASE_DOMAIN" {
  description = "Base domain for the site"
  type        = string
}

variable "ZONE_ID" {
  description = "Zone ID of the domain"
  type        = string
}

variable "MISSKEY_API_KEY" {
  description = "The API key of the Misskey instance"
  type        = string
}
