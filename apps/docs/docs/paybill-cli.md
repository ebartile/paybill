---
id: paybill-cli
title: Paybill CLI
---

Paybill CLI is a powerful tool that empowers developers to effortlessly create and enhance Marketplace plugins for Paybill workspace.

## Installation

In order to manage plugins for the Paybill marketplace, including creating, updating, and deleting, you will need to utilize **[paybill-cli](https://www.npmjs.com/package/@paybilldev/cli)**. This can be installed via npm by entering the following command:

```bash
npm install -g @paybilldev/cli
```

#### Ensure the installation was successful

```bash
paybill --version
```

## Commands

### info

This command returns the information about where paybill is being run

```bash
paybill info
```

### create plugin

This command creates a new plugin.

```bash
paybill --prefix plugin create PLUGIN_NAME
```

:::tip
Read the detailed guide on creating a marketplace plugin [here](/marketplace/creating-a-plugin).
:::

### delete

This command deletes a plugin.

```bash
paybill plugin delete PLUGIN_NAME
```

The CLI will prompt developers to verify if the plugin to be deleted is a marketplace plugin before proceeding with the deletion.

### install

Installs a new npm module inside a paybill plugin

```bash
paybill plugin install [NPM_MODULE] --plugin <value>
```