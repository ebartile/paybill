---
id: ubuntu
title: Ubuntu
---

:::warning
The following guide is intended for contributors to set-up Paybill locally. If you're interested in **self-hosting** Paybill, please refer to the **[Setup](/docs/setup/)** section.
:::

Follow these steps to setup and run Paybill on Ubuntu. Open terminal and run the commands below.

## Setting up

1. Set up the environment

    1.1 Install NVM
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    ```

    Use the command to load NVM:
    ```bash
    source ~/.nvm/nvm.sh
    ```

    Close and reopen your terminal to start using nvm
    ```bash
    nvm install 18.18.2
    ```

    Ensure you have the correct version of npm, or it will cause an error about fsevents.
    ```bash
    npm i -g npm@9.8.1
    npm install -g pnpm@10.13.1
    ```

    1.2 Install Postgres
    ```bash
    sudo apt install postgresql postgresql-contrib
    sudo apt-get install libpq-dev
    ```
    
2. Setup the repository:

    2.1 Fork the repository:

    Go to the [Paybill GitHub repository](https://github.com/paybilldev/paybill), click on the **Fork** button to create a copy of the repository under your own GitHub account.

    2.2 Clone your forked repository:

    After forking, clone the forked repository to your local machine using the URL of your forked repo.

    ```bash
    git clone https://github.com/<your-username>/paybill.git
    ```
    
3. Set up environment variables

    Create a `.env` file by copying `.env.example`. More information on the variables that can be set is given in the [environment variables reference](/docs/setup/env-vars)
    ```bash
    cp .env.example .env
    ```

4. Populate the keys in the env file
   :::info
   `APP_KEY` requires a 64 byte key. (If you have `openssl` installed, run `openssl rand -hex 64` to create a 64 byte secure   random key)
   :::

    Paybill requires the following environment variables to be set.   
   
   ```envs
   PAYBILL_HOST=http://localhost:4000
   APP_KEY= <generate using 'openssl rand -hex 64'>
   NODE_ENV=development

   PG_HOST=localhost
   PG_PORT=5432
   PG_USER=postgres
   PG_PASS=postgres
   PG_DB=paybill_development
   
   PB_DB=paybill_db
   PB_DB_USER=postgres
   PB_DB_HOST=localhost
   PB_DB_PASS=postgres
   ```

   Paybill requires two separate databases to function correctly `pg_db` and `paybill_db`,
   While both databases can reside on the same PostgreSQL host, they must be separate databases to avoid conflicts.

5. Install and build dependencies
    ```bash
    pnpm install
    pnpm build
    ```
   
    :::note 
    If the `pnpm build` command fails due to some packages are missing, try running the following command to install the necessary packages:
    `sudo apt install build-essential`
    then proceed to `pnpm build` step again.
    :::

6. Set up database
    ```bash
    pnpm run --prefix server db:create
    ```
    :::info
    If at any point you need to reset the database, use this command `pnpm --prefix server db:reset`
    :::

7. Run the server
    ```bash
    pnpm start:dev
    ```

    The client will start on the port 4000, you can access the client by visiting:  [http://localhost:4000](http://localhost:4000)

    The server will start on the port 8000, you can access the server by visiting:  [http://localhost:8000](http://localhost:8000)

10. Create login credentials

    Visiting https://localhost:4000 should redirect you to the login page, click on the signup link and enter your email. The emails sent by the server in development environment are captured and are opened in your default browser. Click the invitation link in the email preview to setup the account.


## Running tests

Test config requires the presence of `.env.test` file at the root of the project.

To run the unit tests
```bash
pnpm --prefix server test
```

To run e2e tests
```bash
pnpm --prefix server test:e2e
```

To run a specific unit test
```bash
pnpm --prefix server test <path-to-file>
```