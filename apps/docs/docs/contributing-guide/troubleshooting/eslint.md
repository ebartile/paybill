---
id: eslint
title: EsLint
---

# ESLint 

ESLint as a code quality tool is a tool that checks your code for errors and helps you to fix them and enforces a coding style. 


## Setup


1. Install the [ESLint extension](https://eslint.org/docs/latest/user-guide/integrations) for your code editor.
2. Set your editor's default formatter to `ESLint`.

:::tip
For VSCode users, you can set the formatter to `ESLint` in the [**settings.json**](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson).
:::

3. Install the dependencies.
    ```bash
    pnpm install
    ```
4. Run the linter.
    ```bash
    pnpm --prefix server lint
    pnpm --prefix frontend lint
    ```
5. Fix the ESlint errors and warnings.
    ```bash
    pnpm --prefix server format
    pnpm --prefix frontend format
    ```

## Requirements

1. **Node version 18.18.2**
2. **npm version 9.8.1**

:::tip
It is recommended to check the VSCode **Setting.json**(Press `ctrl/cmnd + P` and search `>Settings (JSON)`) file to ensure there are no overrides to the eslint config rules. Comment the following rules for eslint: **eslint.options: `{...}`**.
:::