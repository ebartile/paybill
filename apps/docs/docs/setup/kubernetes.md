---
id: kubernetes
title: Kubernetes
---

# Deploying Paybill on Kubernetes

:::info
You should setup a PostgreSQL database manually to be used by Paybill.
:::

This repository contains Kubernetes files for deploying [Paybill](https://github.com/paybilldev/paybill/tree/main/deploy/kubernetes).

Follow the steps below to deploy Paybill on a Kubernetes cluster.

1. **Setup a PostgreSQL database** <br/>
   Paybill uses a postgres database as the persistent storage for storing data related to users and apps. We do not have plans to support other databases such as MySQL.
2. **Create a Kubernetes secret with name `server`.** <br/>
   For the setup, Paybill requires:

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

3. Create a Kubernetes deployment

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/deployment.yaml
   ```

:::info
The file given above is just a template and might not suit production environments. You should download the file and configure parameters such as the replica count and environment variables according to your needs.
:::

:::info
If there are self signed HTTPS endpoints that Paybill needs to connect to, please make sure that `NODE_EXTRA_CA_CERTS` environment variable is set to the absolute path containing the certificates. You can make use of kubernetes secrets to mount the certificate file onto the containers.
:::

4. Verify if Paybill is running

   ```bash
    kubectl get pods
   ```

5. Create a Kubernetes services to publish the Kubernetes deployment that you've created. This step varies with cloud providers. We have a [template](https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/service.yaml) for exposing the Paybill server as a service using an AWS loadbalancer.

   **Examples:**

   - [Application load balancing on Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html)
   - [GKE Ingress for HTTP(S) Load Balancing](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress)

:::tip
If you want to serve Paybill client from services such as Firebase or Netlify, please read the client Setup documentation **[here](/docs/setup/client)**.
:::

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `paybilldev/paybill:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

_If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev._