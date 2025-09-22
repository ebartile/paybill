---
id: google-cloud-run
title: Google Cloud Run
---

# Deploying Paybill on Google Cloud Run

:::info
You should setup a PostgreSQL database manually to be used by Paybill.
:::

Follow the steps below to deploy Paybill on Cloud run with `gcloud` CLI.

## Deploying Paybill application

1. Create a new Google Cloud Run Service:

<div style={{textAlign: 'left'}}>
  <img className="screenshot-full" src="/img/setup/cloud-run/google-cloud-run-setup.png" alt="Google Cloud Run New Setup" />
</div>

2. Ingress and Authentication can be set as shown below, to begin with. Feel free to change the security configurations as per you see fit.

<div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/setup/cloud-run/ingress-auth.png" alt="ingress-auth" />
</div>

3. Under containers tab, please make sure the port is set to 3000 and command `pnpm, start:prod` is entered in container argument field with CPU capacity set to 2GiB:

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/setup/cloud-run/port-and-capacity-postgres-v2.png" alt="port-and-capacity-paybill" />
  </div>

- If the command mentioned above is not compatible, please use the following command structure instead:

 <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/setup/cloud-run/port-and-capacity-postgres-alternative-command.png" alt="port-and-capacity-paybill-alternative-command" />
  </div>

- Should you encounter any migration issues, please execute the following command. Be aware that executing this command may cause the revision to break. However, modifying the command back to `pnpm, start:prod` will successfully reboot the instance:

 <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/setup/cloud-run/port-and-capacity-postgres-migration-fix-command.png" alt="port-and-capacity-paybill-migration-fix-command" />
  </div>

4. Under environmental variable please add the below Paybill application variables. You can also refer env variable [**here**](/docs/setup/env-vars).

Update `PAYBILL_HOST` environment variable if you want to use the default url assigned with Cloud run after the initial deploy.

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/setup/cloud-run/env-variable-paybill.png" alt="env-variable-paybill" />
  </div>

:::tip
If you are using [Public IP](https://cloud.google.com/sql/docs/postgres/connect-run) for Cloud SQL, then database host connection (value for `PG_HOST`) needs to be set using unix socket format, `/cloudsql/<CLOUD_SQL_CONNECTION_NAME>`.  
:::

5. Please go to the connection tab. Under Cloud SQL instance please select the PostgreSQL database which you have set-up.

  <div style={{textAlign: 'center'}}>
  <img className="screenshot-full" src="/img/setup/cloud-run/cloud-SQL-paybill.png" alt="cloud-SQL-paybill" />
  </div>

Click on deploy once the above parameters are set.

:::info
Once the Service is created and live, to make the Cloud Service URL public. Please follow the steps [**here**](https://cloud.google.com/run/docs/securing/managing-access) to make the service public.
:::

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `paybilldev/paybill:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

_If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev._