#!/bin/bash

set -e
# Setup prerequisite dependencies
sudo apt-get update
sudo apt-get -y install --no-install-recommends wget gnupg ca-certificates apt-utils git curl postgresql-client
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18.18.2
sudo ln -s "$(which node)" /usr/bin/node
sudo ln -s "$(which pnpm)" /usr/bin/pnpm
sudo ln -s "$(which npm)" /usr/bin/npm

# Setup openresty
wget -O - https://openresty.org/package/pubkey.gpg | sudo apt-key add -
echo "deb http://openresty.org/package/ubuntu bionic main" > openresty.list
sudo mv openresty.list /etc/apt/sources.list.d/
sudo apt-get update
sudo apt-get -y install --no-install-recommends openresty
sudo apt-get install -y curl g++ gcc autoconf automake bison libc6-dev \
     libffi-dev libgdbm-dev libncurses5-dev libsqlite3-dev libtool \
     libyaml-dev make pkg-config sqlite3 zlib1g-dev libgmp-dev \
     libreadline-dev libssl-dev libmysqlclient-dev build-essential \
     freetds-dev libpq-dev
sudo apt-get install -y luarocks
sudo luarocks install lua-resty-auto-ssl
sudo mkdir /etc/resty-auto-ssl /var/log/openresty /etc/fallback-certs
sudo chown -R www-data:www-data /etc/resty-auto-ssl

# Gen fallback certs
sudo openssl rand -out /home/ubuntu/.rnd -hex 256
sudo chown www-data:www-data /home/ubuntu/.rnd
sudo openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 \
     -subj '/CN=sni-support-required-for-valid-ssl' \
     -keyout /etc/fallback-certs/resty-auto-ssl-fallback.key \
     -out /etc/fallback-certs/resty-auto-ssl-fallback.crt

# Setup nginx config
export PAYBILL_HOST="${PAYBILL_HOST:=localhost}"
export PAYBILL_USER="${PAYBILL_USER:=www-data}"
VARS_TO_SUBSTITUTE='$PAYBILL_HOST:$PAYBILL_USER'
envsubst "${VARS_TO_SUBSTITUTE}" < /tmp/nginx.conf > /tmp/nginx-substituted.conf
sudo cp /tmp/nginx-substituted.conf /usr/local/openresty/nginx/conf/nginx.conf

# Setup app as systemd service
sudo cp /tmp/web.service /lib/systemd/system/web.service

# Setup app directory
mkdir -p ~/app
git clone -b main https://github.com/paybilldev/paybill.git ~/app && cd ~/app


mv /tmp/.env ~/app/.env
mv /tmp/setup_app ~/app/setup_app
sudo chmod +x ~/app/setup_app

npm install -g npm@9.8.1
npm install -g pnpm@10.13.1

# Building Paybill app
PAYBILL_EDTION=ce pnpm build