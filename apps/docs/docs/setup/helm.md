---
id: helm
title: Helm
---

# Deploying Paybill with Helm Chart

This repository contains Helm charts for deploying [Paybill](https://github.com/paybilldev/paybill/tree/main/deploy/helm) on a Kubernetes Cluster using Helm v3. The charts include an integrated PostgreSQL server that is enabled by default. However, you have the option to disable it and configure a different PostgreSQL server by updating the `values.yaml` file.

## Installation

### From Helm repo

```bash
helm repo add paybill https://paybill.dev.github.io/paybill
helm install paybill paybilldev/paybill
```

### From the Source

1. Clone the repository and navigate to the chart directory:

```bash
git clone https://github.com/paybilldev/paybill.git
cd paybill/deploy/helm
````

2. Run the following to fetch chart dependencies:

```bash
helm dependency update
```

3. (Optional but recommended) Modify `values.yaml` to customize configuration such as postgres usernames, passwords and other settings.

4. Install the chart:

```bash
helm install $RELEASE_NAME . -n $NAMESPACE --create-namespace
```

Remember to replace the variables with your specific configuration values.

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `paybilldev/paybill:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

_If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev._