---
id: openshift
title: Openshift
---

# Deploying Paybill on Openshift

:::info
You should setup a PostgreSQL database manually to be used by Paybill.
:::

Follow the steps below to deploy Paybill on Openshift.

1. Setup a PostgreSQL database Paybill uses a postgres database as the persistent storage for storing data related to users and apps. We do not have plans to support other databases such as MySQL.

2. Create a Kubernetes secret with name `server`. For the setup, Paybill requires:

- **PB_DB**
- **PB_DB_HOST**
- **PB_DB_USER**
- **PB_DB_PASS**
- **PG_HOST**
- **PG_DB**
- **PG_USER**
- **PG_PASS**
- **APP_KEY**

Read **[environment variables reference](/docs/setup/env-vars)**

3. Once you have logged into the Openshift developer dashboard click on `+Add` tab. Select import YAML from the local machine.

:::note
When entering one or more files and use --- to separate each definition
:::

Copy paste deployment.yaml to the online editor

```
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/openshift/deployment.yaml
```

Copy paste the service.yaml to the online editor

```
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/openshift/service.yaml
```

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/setup/openshift/online-yaml-editor.png" alt="online yaml editor" />
 
</div>

Once you have added the files click on create.

:::info
If there are self signed HTTPS endpoints that Paybill needs to connect to, please make sure that `NODE_EXTRA_CA_CERTS` environment variable is set to the absolute path containing the certificates. You can make use of kubernetes secrets to mount the certificate file onto the containers.
:::

4. Navigate to topology tab and use the visual connector to establish the connect between paybill-deployment and postgresql as shown in the screenshot below.

<div style={{textAlign: 'center'}}>

<img className="screenshot-full" src="/img/setup/openshift/toplogy.png" alt="topology" />
 
</div>

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `paybilldev/paybill:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

_If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev._