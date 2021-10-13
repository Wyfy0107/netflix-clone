resource "aws_iam_role" "netflix_instance" {
  name = "NetflixInstanceRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "netflix_instance" {
  name = "NetflixInstancePolicy"
  role = aws_iam_role.netflix_instance.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "route53:ChangeResourceRecordSets",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:route53:::hostedzone/${var.hosted_zone_id}"
      },
      {
        Action = [
          "route53:ListHostedZones",
          "route53:GetChange",
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}
