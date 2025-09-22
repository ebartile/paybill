---

id: netlify
title: Netlify

---

# Deploying Paybill Client

Paybill client is a standalone application and can be deployed on static website hosting services such as Netlify, Firebase, S3/Cloudfront, etc.

You can build the standalone client with the following command:

```bash
pnpm build:client
```

*If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at [info@paybill.dev](mailto:info@paybill.dev).*

## On Netlify

### Deploy via Netlify CLI

1. Install Netlify CLI globally if not already installed:

   ```bash
   npm install -g netlify-cli
   ```

2. Login to your Netlify account:

   ```bash
   netlify login
   ```

3. Initialize the Netlify project (if not already):

   ```bash
   netlify init
   ```

   * Choose “Deploy manually”
   * Set **`dist/`** as the directory to deploy
   * Select or create a new site

4. Deploy the site:

   ```bash
   netlify deploy --prod --dir=dist
   ```

   Your site will be deployed and a public URL will be provided.

### Deploy via Netlify Web UI

1. Go to [Netlify Dashboard](https://app.netlify.com/) and create a new site from Git.

2. Connect your repository (GitHub, GitLab, Bitbucket).

3. Set the following build settings:

   * **Build Command:** `pnpm build:client`
   * **Publish Directory:** `dist`

4. Add the following **environment variable** in the Netlify UI:

   * `API_BASE_URL=https://server.paybill.dev`

5. Click **Deploy Site**.

Once deployed, Netlify will give you a public URL (which you can customize), and handle CDN and HTTPS automatically.

---

## Upgrading to the Latest LTS Version

New LTS versions are released every 3–5 months with an end-of-life of at least 18 months. To check the latest LTS version, visit the [Paybill Docker Hub](https://hub.docker.com/r/paybilldev/paybill/tags) page. LTS tags follow a naming convention with the prefix `LTS-` followed by the version number, for example: `paybilldev/paybill:ee-lts-latest`.

If this is a new installation of the application, you may start directly with the latest version. This guide is not required for new installations.

#### Prerequisites for Upgrading to the Latest LTS Version:

* It is crucial to perform a **comprehensive backup of your database** before starting the upgrade process to prevent data loss.

---

*If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at [info@paybill.dev](mailto:info@paybill.dev).*

---
