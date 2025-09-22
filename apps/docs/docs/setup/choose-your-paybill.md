---
id: choose-your-paybill
title: Deployment Version
---

Paybill versions are categorized into three main types: **Long-Term Support (LTS)**, **Pre-Release**, and **Past versions**. Understanding these categories helps users choose the most suitable version for their needs.

## Long-Term Support (LTS) Versions

We highly recommend using LTS versions for most users. These versions are prioritized for bug fixes, updates, and overall stability, ensuring a reliable experience. LTS versions are ideal for production environments where stability and consistent performance are crucial.

Please find the latest LTS version here: <br/>
[Docker Hub - LTS Versions](https://hub.docker.com/r/paybilldev/paybill/tags?page_size=&ordering=&name=ee-lts)

| Version                                                                                                                                                                       | Release Date      | Docker Pull Command                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------- |
| Latest EE-LTS                                                                                                                                                                 | N/A               | `docker pull paybilldev/paybill:ee-lts-latest`  |

:::info
Users are encouraged to upgrade to the latest LTS version to ensure they benefit from the latest improvements and maintain a secure and efficient environment.
:::

## Pre-Release Versions

Pre-Release versions are designed for those looking to explore the latest features and advancements in Paybill. These versions are experimental and may include new functionalities not yet available in LTS versions. However, due to their experimental nature, they may also contain bugs and lack the stability of LTS versions. Therefore, we advise against using Pre-Release versions in production environments.

_All versions starting from **0.1.x.x** are considered Pre-Release versions._

## Past versions (Not maintained anymore)

Past versions of Paybill are those that are no longer actively maintained or supported. These versions may still be available but are not recommended, especially in production environments, as they do not receive updates, bug fixes, or security patches.