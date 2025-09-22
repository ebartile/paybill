---
id: kubernetes-eks
title: Kubernetes (EKS)
---

Follow the steps below to deploy Paybill on an EKS Kubernetes cluster.

:::info
You should set up a PostgreSQL database manually to be used by Paybill. We recommend using an RDS PostgreSQL database. You can find the system requirements [here](/docs/setup/system-requirements#postgresql)
:::

1. Create an EKS cluster and connect to it to start with the deployment. You can follow the steps as mentioned in the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html).

2. Create a k8s Deployment:

_The file below is just a template and might not suit production environments. You should download the file and configure parameters such as the replica count and environment variables according to your needs._

```
kubectl apply -f https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/EKS/deployment.yaml
```

Make sure to edit the environment variables in the `deployment.yaml`. We advise using secrets to set up sensitive information. You can check out the available options [here](/docs/setup/env-vars).

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
- **API_KEY** 
</ul>
<br/>
Read **[environment variables reference](/docs/setup/env-vars)**
:::

3. Create a Kubernetes service to publish the Kubernetes deployment that you have created. We have a [template](https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/EKS/service.yaml) for exposing the Paybill server as a service using an AWS Load Balancer.

**Example:**

- [Application load balancing on Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html)

## Database

Update Paybill deployment with the appropriate env variables [here](https://raw.githubusercontent.com/paybilldev/paybill/refs/heads/master/deploy/kubernetes/EKS/deployment.yaml) and apply the changes.

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of at least 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `paybilldev/paybill:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

_If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev._