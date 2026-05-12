variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "triathlon-calc"
}

variable "bucket_name" {
  type    = string
  default = "triathlon-calc-app"
}

variable "domain" {
  type    = string
  default = "calculadoratri.r29tecnologia.com.br"
}

variable "hosted_zone_id" {
  type    = string
  default = "Z30DIUAOH8GO17"
}
