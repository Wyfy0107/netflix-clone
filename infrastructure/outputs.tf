output "instance_ip" {
  value = aws_instance.netflix[0].public_ip
}
