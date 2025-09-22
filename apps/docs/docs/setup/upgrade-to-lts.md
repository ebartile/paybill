---
id: upgrade-to-lts
title: Upgrading Paybill to the LTS Version
---

Paybill has released its first Long Term Support (LTS) version, which provides extended support and stability for your environments. Upgrading to this LTS version ensures you benefit from the latest features and security updates while maintaining a stable and supported environment.

### Check the latest LTS Version

Paybill will be releasing new LTS versions every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `paybilldev/paybill:ee-lts-latest`.

### Prerequisites

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

### Upgrade Process

The upgrade process depends on your deployment method. You can follow the upgrade process under the respective setup guides:

- [Upgrade Paybill on DigitalOcean](/docs/setup/digitalocean#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on Docker](/docs/setup/docker#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on AWS AMI](/docs/setup/ami#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on AWS ECS](/docs/setup/ecs#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on OpenShift](/docs/setup/openshift#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on Helm](/docs/setup/helm#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on Kubernetes](/docs/setup/kubernetes#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on Kubernetes(GKE)](/docs/setup/kubernetes-gke#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on Kubernetes(AKS)](/docs/setup/kubernetes-aks#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on Azure Container Apps](/docs/setup/azure-container#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on Google Cloud Run](/docs/setup/google-cloud-run#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on Firebase](/docs/setup/firebase#upgrading-to-the-latest-lts-version)
- [Upgrade Paybill on Netlify](/docs/setup/netlify#upgrading-to-the-latest-lts-version)