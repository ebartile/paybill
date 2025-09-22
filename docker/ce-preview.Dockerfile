FROM node:18.18.2-buster AS builder
# Fix for JS heap limit allocation issue
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN mkdir -p /app

WORKDIR /app

# Build paybill
COPY . ./paybill/
RUN pnpm --prefix server install
RUN pnpm --prefix server build

FROM debian:11

RUN apt-get update -yq \
    && apt-get install curl gnupg zip -yq \
    && apt-get install -yq build-essential \
    && apt-get clean -y


RUN curl -O https://nodejs.org/dist/v18.18.2/node-v18.18.2-linux-x64.tar.xz \
    && tar -xf node-v18.18.2-linux-x64.tar.xz \
    && mv node-v18.18.2-linux-x64 /usr/local/lib/nodejs \
    && echo 'export PATH="/usr/local/lib/nodejs/bin:$PATH"' >> /etc/profile.d/nodejs.sh \
    && /bin/bash -c "source /etc/profile.d/nodejs.sh" \
    && rm node-v18.18.2-linux-x64.tar.xz
ENV PATH=/usr/local/lib/nodejs/bin:$PATH

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN apt-get update && \
    apt-get install -y postgresql-client freetds-dev libaio1 wget && \
    apt-get -o Dpkg::Options::="--force-confold" upgrade -q -y --force-yes && \
    apt-get -y autoremove && \
    apt-get -y autoclean

WORKDIR /

RUN mkdir -p /app /var/log/supervisor
COPY /deploy/docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /app

# ENV defaults
ENV PAYBILL_HOST=http://localhost:80 \
    PB_DB=paybilldev_db \
    PORT=80 \
    APP_KEY=replace_with_app_key

CMD ["/usr/bin/supervisord"]