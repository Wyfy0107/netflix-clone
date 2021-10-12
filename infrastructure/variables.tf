variable "region" {
  default = "us-east-1"
}

variable "aws_access_key" {
  type = string
}

variable "aws_secret_key" {
  type = string
}

variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_cidr" {
  type = string
}

variable "public_subnets_cidr" {
  type = list(string)
}

variable "hosted_zone_arn" {
  type = string
}

variable "certbot_domain" {
  default = "netflix.mlem-mlem.net"
}

variable "certbot_email" {
  type = string
}
