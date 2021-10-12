#!/usr/bin/env bash

sudo apt update
sudo apt upgrade -y

# Install node
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
sudo apt install --no-install-recommends yarn

# Install pm2
sudo yarn global add pm2
eval "$(pm2 startup | grep sudo)"

# Logging Config
sudo pm2 install pm2-logrotate
sudo pm2 set pm2-logrotate:max_size 10M
sudo pm2 set pm2-logrotate:retain 5

# Install certbot
sudo snap install core
sudo snap refresh core

sudo snap remove certbot
sudo snap remove certbot-dns-route53
sudo apt remove certbot
sudo rm /usr/bin/certbot

sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo snap set certbot trust-plugin-with-root=ok
sudo snap install certbot-dns-route53
sudo certbot certonly --dns-route53 \
  -d ${certbot_domain} \
  -m ${certbot_email} \
  --agree-tos -n

echo "00 3 * * 1 /usr/bin/certbot renew --dns-route53 --dns-route53-propagation-seconds 30" | crontab

# Install and Configure nginx
sudo apt --assume-yes install nginx
sudo rm /etc/nginx/nginx.conf

[[ ! -d $HOME/app ]] && mkdir $HOME/app
[[ -f /tmp/.env ]] && mv /tmp/.env $HOME/app

[[ -f /tmp/nginx.conf ]] && sudo mv /tmp/nginx.conf /etc/nginx

sudo systemctl restart nginx