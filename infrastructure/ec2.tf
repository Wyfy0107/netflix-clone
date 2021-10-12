locals {
  common_tags = {
    managed_by = "terraform"
    project    = "netflix-clone"
  }
}

resource "aws_instance" "netflix" {
  count                = 1
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = "t3.micro"
  iam_instance_profile = aws_iam_instance_profile.netflix_instance.name
  subnet_id            = aws_subnet.public[0].id
  key_name             = aws_key_pair.ec2.key_name

  vpc_security_group_ids = [aws_security_group.ec2.id]
  tags                   = local.common_tags
}

resource "aws_key_pair" "ec2" {
  key_name   = "NetflixInstanceKey"
  public_key = file("${path.module}/ec2.key.pub")
}

resource "aws_iam_instance_profile" "netflix_instance" {
  name = "NetflixInstanceProfile"
  role = aws_iam_role.netflix_instance.name
}

resource "aws_eip" "ec2_ip" {
  count    = 1
  instance = aws_instance.netflix[0].id
  vpc      = true
}

resource "aws_security_group" "ec2" {
  name        = "NetflixInstanceSecurityGroup"
  description = "security group for ec2"
  vpc_id      = aws_vpc.netflix.id

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
  }

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
  }

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  }

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    to_port     = 0
    protocol    = -1
  }
}

resource "null_resource" "provision" {
  triggers = {
    env       = sha1(file("server-provision/.env"))
    bootstrap = sha1(file("server-provision/bootstrap.sh"))
    nginx     = sha1(file("server-provision/nginx.conf"))
  }

  connection {
    host        = aws_eip.ec2_ip[0].public_ip
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("${path.module}/ec2.key")
  }

  provisioner "file" {
    source      = "server-provision/nginx.conf"
    destination = "/tmp/nginx.conf"
  }

  provisioner "file" {
    source      = "server-provision/.env"
    destination = "/tmp/.env"
  }

  provisioner "file" {
    content     = data.template_file.init_script.rendered
    destination = "/tmp/init.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/init.sh",
      "/tmp/init.sh"
    ]
  }
}

resource "aws_route53_record" "netflix_instance" {
  zone_id         = var.route53_hosted_zone_id
  name            = var.domain_name
  type            = "A"
  ttl             = "300"
  records         = [aws_eip.ec2_ip.public_ip]
  allow_overwrite = true
}
