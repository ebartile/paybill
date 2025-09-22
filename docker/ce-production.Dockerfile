FROM node:18.18.2-buster AS builder

# Fix for JS heap limit allocation issue
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm i -g npm@9.8.1
RUN npm i -g pnpm@10.13.1

RUN mkdir -p /app

WORKDIR /app

# Build frontend
COPY ./frontend/ ./frontend/
RUN pnpm --prefix frontend install
RUN pnpm --prefix frontend build --production
RUN pnpm --prefix frontend prune --production

ENV NODE_ENV=production

# Build paybill
COPY ./paybill/ ./paybill/
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

RUN mkdir -p /app

# Define non-sudo user
RUN useradd --create-home --home-dir /home/appuser appuser \
    && chown -R appuser:0 /app \
    && chown -R appuser:0 /home/appuser \
    && chmod u+x /app \
    && chmod -R g=u /app

# Set pnpm cache directory
ENV pnpm_config_cache /home/appuser/.pnpm

ENV HOME=/home/appuser
USER appuser

WORKDIR /app

ENTRYPOINT ["./paybill/scripts/entrypoint.sh"]