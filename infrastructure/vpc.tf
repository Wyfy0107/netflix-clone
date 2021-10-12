resource "aws_vpc" "netflix" {
  cidr_block = var.vpc_cidr
  tags       = local.common_tags
}

resource "aws_subnet" "public" {
  count             = 1
  vpc_id            = aws_vpc.netflix.id
  cidr_block        = var.public_subnets_cidr[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags              = local.common_tags
}

resource "aws_internet_gateway" "netflix" {
  vpc_id = aws_vpc.netflix.id
  tags   = local.common_tags
}

resource "aws_route_table" "netflix" {
  vpc_id = aws_vpc.netflix.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.netflix.id
  }

  tags = local.common_tags
}

resource "aws_route_table_association" "netflix_route_table" {
  count          = 1
  route_table_id = aws_route_table.netflix.id
  subnet_id      = aws_subnet.public[count.index].id
}
