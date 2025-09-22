---
id: digitalocean
title: DigitalOcean
---

Follow the steps below to deploy Paybill on a DigitalOcean Droplet.

**1. Navigate to the Droplets section in DigitalOcean.**

  <div style={{textAlign: 'center'}}>

  <img className="screenshot-full" src="/img/setup/digitalocean/droplet_1.png" alt="create a Droplet" />

  </div>

**2. Configure the **Droplet** with the following options:**

- **Image**: Ubuntu
- **Plan**: Choose a plan (e.g., Basic, 4GB RAM, 2 vCPU)

  <div style={{textAlign: 'center'}}>
     <img className="screenshot-full" src="/img/setup/digitalocean/droplet_plan.png" alt="use a droplet plan" />
  </div>
  
  - **Auth**: For authentication, use password or ssh
  - Click **Create Droplet** and note the assigned public IP

**3. Create a Firewall for the **Droplets** to allow required ports.**

| protocol | port | allowed_cidr |
| :------- | :--- | :----------- |
| tcp      | 22   | your IP      |
| tcp      | 80   | 0.0.0.0/0    |
| tcp      | 443  | 0.0.0.0/0    |

**4. Connect to the **Droplets** via SSH.**

**5. Install Docker and Docker Compose using the following commands:**

```bash
apt update && apt upgrade -y
apt install -y docker.io
```

Enable and start Docker:

```bash
systemctl enable docker
systemctl start docker
```

Install Docker Compose:

```bash
apt install -y curl
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

Verify installation:

```bash
docker --version
docker-compose --version
```

**6. Update the `Paybill_HOST` in the `.env` file:**

`PAYBILL_HOST=http://<public_ip>:80`

**7. Use the [Docker Documentation](/docs/setup/docker) to deploy Paybill.**

## Upgrading to the Latest LTS Version

New LTS versions are released every 3-5 months with an end-of-life of atleast 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. The LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example `paybilldev/paybill:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

- It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev.