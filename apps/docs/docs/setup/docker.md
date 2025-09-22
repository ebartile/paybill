---
id: docker
title: Docker
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Deploying Paybill using Docker Compose

Follow the steps below to deploy Paybill on a server using Docker Compose. Paybill requires a PostgreSQL database to store applications definitions, (encrypted) credentials for datasources and user authentication data.

:::info
If you rather want to try out Paybill on your local machine with Docker, you can follow the steps [here](/docs/setup/try-paybill/).
:::

### Installing Docker and Docker Compose

Install docker and docker-compose on the server.

- Docs for [Docker Installation](https://docs.docker.com/engine/install/)
- Docs for [Docker Compose Installation](https://docs.docker.com/compose/install/)

### Deployment options

There are two options to deploy Paybill using Docker Compose:

1. **With in-built PostgreSQL database (recommended)**. This setup uses the official Docker image of PostgreSQL.
2. **With external PostgreSQL database**. This setup is recommended if you want to use a managed PostgreSQL service such as AWS RDS or Google Cloud SQL.

Confused about which setup to select? Feel free to ask the community via [Discord](https://discord.gg/v9rYchap).

<Tabs>
  <TabItem value="with-in-built-postgres" label="With in-built PostgreSQL" default>

1. Download our production docker-compose file into the server.

```bash
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/docker/docker-compose-db.yaml
mv docker-compose-db.yaml docker-compose.yaml
mkdir postgres_data
```

2. Create `.env` file in the current directory (where the docker-compose.yaml file is downloaded as in step 1):

```bash
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/docker/.env.internal.example
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/docker/internal.sh && chmod +x internal.sh
mv .env.internal.example .env && ./internal.sh
```

`internal.sh` helps to generate the basic .env variables such as the APP_KEY, and the password for postgreSQL database.

3. To start the docker container, use the following command:

```bash
docker-compose up -d
```

4. **(Optional)** `PAYBILL_HOST` environment variable can either be the public ipv4 address of your server or a custom domain that you want to use. Which can be modified in the .env file.

Also, for setting up additional environment variables in the .env file, please check our documentation on [environment variable](/docs/setup/env-vars)

Examples:
`PAYBILL_HOST=http://12.34.56.78` or
`PAYBILL_HOST=https://paybill.yourdomain.com`

If you've set a custom domain for `PAYBILL_HOST`, add a `A record` entry in your DNS settings to point to the IP address of the server.

:::info
i. Please make sure that `PAYBILL_HOST` starts with either `http://` or `https://`

ii. Setup docker to run without root privileges by following the instructions written here https://docs.docker.com/engine/install/linux-postinstall/

iii. If you're running on a linux server, `docker` might need sudo permissions. In that case you can either run:
`sudo docker-compose up -d`
:::

### Docker Backup (Only For In-Built PostgreSQL)

The below bash script will help with taking back-up and as well as restoring:

1. Download the script:

```bash
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/docker/backup-restore.sh && chmod +x backup-restore.sh
```

2. Run the script with the following command:

```bash
./backup-restore.sh
```

  </TabItem>
  <TabItem value="with-external-postgres" label="With external PostgreSQL">

1. Setup a PostgreSQL database and make sure that the database is accessible.

2. Download our production docker-compose file into the server.

```bash
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/docker/docker-compose.yaml
```

3. Create `.env` file in the current directory (where the docker-compose.yaml file is downloaded as in step 1):

Kindly set the postgresql database credentials according to your external database. Please enter the database details with the help of the bash.

```bash
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/docker/external.sh
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/docker/.env.external.example && chmod +x external.sh
mv .env.external.example .env && ./external.sh
```

4. To start the docker container, use the following command:

```bash
docker-compose up -d
```

5. **(Optional)** `PAYBILL_HOST` environment variable can either be the public ipv4 address of your server or a custom domain that you want to use. Which can be modified in the .env file.

Also, for setting up additional environment variables in the .env file, please check our documentation on [environment variable](/docs/setup/env-vars)

Examples:
`PAYBILL_HOST=http://12.34.56.78` or
`PAYBILL_HOST=https://paybill.yourdomain.com`

If you've set a custom domain for `PAYBILL_HOST`, add a `A record` entry in your DNS settings to point to the IP address of the server.

:::info
i. Please make sure that `PAYBILL_HOST` starts with either `http://` or `https://`

ii. If there are self signed HTTPS endpoints that Paybill needs to connect to, please make sure that `NODE_EXTRA_CA_CERTS` environment variable is set to the absolute path containing the certificates.

iii. If you're running a linux server, `docker` might need sudo permissions. In that case you can either run:
`sudo docker-compose up -d`

iv. Setup docker to run without root privileges by following the instructions written here https://docs.docker.com/engine/install/linux-postinstall/
:::

</TabItem>
</Tabs>

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `paybilldev/paybill:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

_If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev._