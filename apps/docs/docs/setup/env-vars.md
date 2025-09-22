---
id: env-vars
title: Environment variables
---

# Environment variables

Both the Paybill server and client requires some environment variables to start running.

_If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev._

## Paybill server

### Paybill host ( required )

| variable     | description                                                      |
| ------------ | ---------------------------------------------------------------- |
| PAYBILL_HOST | the public URL of Paybill client ( eg: https://app.paybill.dev ) |

### Application Secret ( required )

Paybill server uses a secure 64 byte hexadecimal string to encrypt session cookies. You should set the environment variable `APP_KEY`.

:::tip
If you have `openssl` installed, you can run the following commands to generate the value for `APP_KEY`.

For `APP_KEY` use `openssl rand -hex 64`
:::

### Database configuration ( required )

Paybill server uses PostgreSQL as the database.

| variable | description            |
| -------- | ---------------------- |
| PG_HOST  | postgres database host |
| PG_DB    | name of the database   |
| PG_USER  | username               |
| PG_PASS  | password               |
| PG_PORT  | port                   |

:::tip
If you are using docker-compose setup, you can set PG_HOST as `postgres` which will be DNS resolved by docker
:::

:::info
If you intent you use the DB connection url and if the connection does not support ssl. Please use the below format using the variable DATABASE_URL.
`postgres://username:password@hostname:port/database_name?sslmode=disable`
:::

### Check for updates ( optional )

Self-hosted version of Paybill pings our server to fetch the latest product updates every 24 hours. You can disable this by setting the value of `CHECK_FOR_UPDATES` environment variable to `0`. This feature is enabled by default.

### Marketplace

#### Enable Marketplace plugin developement mode ( optional )

Use this environment variable to enable/disable the developement mode that allows developers to build the plugin.

| variable                    | value             |
| --------------------------- | ----------------- |
| ENABLE_MARKETPLACE_DEV_MODE | `true` or `false` |

### Enable Paybill Database (required)

| variable            | description                                  |
| ------------------- | -------------------------------------------- |
| PB_DB          | Default value is `paybill_db`                |
| PB_DB_HOST     | database host                                |
| PB_DB_USER     | database username                            |
| PB_DB_PASS     | database password                            |
| PB_DB_PORT     | database port                                |

:::tip
The database name provided for `PB_DB` will be utilized to create a new database during server boot process in all of our production deploy setups.
Incase you want to trigger it manually, use the command `pnpm db:create` on Paybill server.
:::

### SENTRY DNS ( optional )

| variable   | description                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------- |
| SENTRY_DNS | DSN tells a Sentry SDK where to send events so the events are associated with the correct project |

### SENTRY DEBUG ( optional )

Prints logs for sentry.

| variable     | description                                 |
| ------------ | ------------------------------------------- |
| SENTRY_DEBUG | `true` or `false`. Default value is `false` |

### NODE_EXTRA_CA_CERTS (optional)

Paybill needs to be configured for custom CA certificate to be able to trust and establish connection over https. This requires you to configure an additional env var `NODE_EXTRA_CA_CERTS` to have absolute path to your CA certificates. This file named `cert.pem` needs to be in PEM format and can have more than one certificates.

| variable            | description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| NODE_EXTRA_CA_CERTS | absolute path to certificate PEM file ( eg: /Paybill/ca/cert.pem ) |

### Disable telemetry ( optional )

Pings our server to update the total user count every 24 hours. You can disable this by setting the value of `TELEMETRY_ENABLED` environment variable to `off`. This feature is enabled by default.

## Paybill client

### Server URL ( optionally required )

This is required when client is built separately.

| variable           | description                                                    |
| ------------------ | -------------------------------------------------------------- |
| PAYBILL_SERVER_URL | the URL of Paybill server ( eg: `https://server.paybill.dev` ) |

### Server Port ( optional)

This could be used to for local development, it will set the server url like so: `http://localhost:<PAYBILL_SERVER_PORT>`

| variable            | description                             |
| ------------------- | --------------------------------------- |
| PAYBILL_SERVER_PORT | the port of Paybill server ( eg: 8000 ) |

## Log file path ( Optional )

If a log file path is specified in environment variables, a log file containing all the data from audit logs will be created at the specified path. The file will be updated every time a new audit log is created.

| Variable      | Description                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| LOGGER_BASE_PATH | the path where the log file will be created ( eg: storage/logs/) |

## Configuring the Default Language

To change the default language, set the LANGUAGE variable to your desired language code.

| Variable | Description     |
| -------- | --------------- |
| LANGUAGE | `LANGUAGE_CODE` |

Available Languages with their codes and native names:

| Language   | Code | Native Name      |
| ---------- | ---- | ---------------- |
| English    | en   | English          |
| French     | fr   | Français         |
| Spanish    | es   | Español          |
| Italian    | it   | Italiano         |
| Indonesian | id   | Bahasa Indonesia |
| Ukrainian  | uk   | Українська       |
| Russian    | ru   | Русский          |
| German     | de   | Deutsch          |

For instance, to set the language to French, you can set the LANGUAGE variable to `fr`.

:::info
The option to set a default language is not available on cloud version of Paybill.
:::