---
id: kubernetes-gke
title: Kubernetes (GKE)
---

# Deploying Paybill on Kubernetes (GKE)

:::info
You should setup a PostgreSQL database manually to be used by Paybill. We recommend using Cloud SQL since this guide is for deploying using GKE.
:::

Follow the steps below to deploy Paybill on a GKE Kubernetes cluster.

1. Create an SSL certificate.

```bash
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/GKE/certificate.yaml
```

Change the domain name to the domain/subdomain that you wish to use for Paybill installation.

2. Reserve a static IP address using `gcloud` cli

```bash
gcloud compute addresses create tj-static-ip --global
```

3. Create k8s deployment

```bash
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/GKE/deployment.yaml
```

Make sure to edit the environment variables in the `deployment.yaml`. You can check out the available options [here](/docs/setup/env-vars).

:::info
For the setup, Paybill requires:
<ul> 
- **PB_DB** 
- **PB_DB_HOST** 
- **PB_DB_USER** 
- **PB_DB_PASS** 
- **PG_HOST** 
- **PG_DB** 
- **PG_USER** 
- **PG_PASS** 
- **APP_KEY** 
</ul>
Read **[environment variables reference](/docs/setup/env-vars)**
:::

:::info
If there are self signed HTTPS endpoints that Paybill needs to connect to, please make sure that `NODE_EXTRA_CA_CERTS` environment variable is set to the absolute path containing the certificates. You can make use of kubernetes secrets to mount the certificate file onto the containers.
:::

4. Create k8s service

```bash
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/GKE/service.yaml
```

5. Create k8s ingress

```bash
curl -LO https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/GKE/ingress.yaml
```

Change the domain name to the domain/subdomain that you wish to use for Paybill installation.

6. Apply YAML configs

```bash
kubectl apply -f certificate.yaml, deployment.yaml, service.yaml, ingress.yaml
```

:::info
It might take a few minutes to provision the managed certificates. [Managed certificates documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs).
:::

You will be able to access your Paybill installation once the pods, service and the ingress is running.

## Database

Update Paybill deployment with the appropriate env variables [here](https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/GKE/deployment.yaml) and apply the changes.

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `paybilldev/paybill:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

_If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev._