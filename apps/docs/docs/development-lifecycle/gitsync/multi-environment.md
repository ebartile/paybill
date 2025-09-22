---
id: multi-environment
title: Configure Environments
---
<div className="badge badge--primary heading-badge">   
  <img 
    src="/img/badge-icons/premium.svg" 
    alt="Icon" 
    width="16" 
    height="16" 
  />
 <span>Paid feature</span>
</div>

Environments in Paybill help manage different stages of application development, ensuring smooth transitions between development, testing, and production. This guide covers what environments are, their purpose, and how they function in Paybill.

Environments make it easier to develop and deploy applications without disrupting production. They keep changes isolated, so testing and debugging can happen without affecting live users. Teams can collaborate more efficiently, as different environments allow them to work independently.

### What are Environments?

An environment in Paybill represents a separate configuration space where **pages**, **data** and **sources** can be defined and managed.

By default, Paybill provides three environments:

-   **Development**: The Development environment is where application development and initial testing take place. It is a dedicated space for Paybill developers to build, configure, and experiment with application features. Changes in this environment do not affect live users, allowing for frequent updates and debugging.
    
-   **Staging**: The Staging environment acts as a pre-production space where applications undergo thorough testing before deployment. It closely resembles the Production environment and helps ensure that all features, performance, and security aspects function as expected. Teams such as QA and product managers use this environment to validate and approve changes before releasing them to end-users.
    
-   **Production**: The Production environment is the final, live version of the application where end users interact with it. This environment is stable and optimized for performance after thorough testing in the Development and Staging environments.
    

### Multi-Environment Support in Paybill

Paybill provides environment management across different components:

#### Applications

Each application has development, staging, and production environments. Developers build  the application in the development environment and then move it to staging for testing. Your testing team can review the application in staging, and once it's thoroughly tested, you can promote it to production and release it to your end users.

#### Data Sources

Data sources can be configured separately for each environment, allowing applications to connect to different databases or APIs depending on the environment. This ensures secure and structured access to relevant data during each stage of development.

### Application Life cycle

The application lifecycle in Paybill involves managing applications across different environments development, staging, and production. You can build the application in development environment and promote it to staging for testing.  After testing you can promote it to production and release the app for your end-users.

You can configure data sources for each environment, and Paybill will automatically use the appropriate ones based on the target environment.

-   **Development** – Developers build and test the application in Paybill.
    
-   **Staging** – The testing or product team validates requirements and tests the application using staging data. Data and queries cannot be edited in this environment.
    
-   **Production** – After thorough testing in staging, the application is promoted to production. This can serve as a pre-release environment where you test with production data before releasing the application to end users. Refer to [Release](/docs/development-lifecycle/release/release-rollback) documentation to learn more.
    
### Impacted behavior with environment permission 

Each environment has a different impact on your application. Please refer the following table for details.

| Action             | Development | Staging | Production |
|--------------------|------------|---------|------------|
| Edit versions     | ✅         | ❌      | ❌         |
| Rename versions   | ✅         | ❌      | ❌         |
| Delete versions   | ✅         | ❌      | ❌         |
| Create new versions | ✅      | ❌      | ❌         |
| Promote           | ✅         | ✅      | -          |


## Setting Up Multi-Instance Environments

To enable a multi-instance setup, you need to deploy separate Paybill instances on your self-hosted infrastructure. Refer to the [setup](/docs/setup/try-Paybill) guide to learn about Paybill self-hosted deployments.

## Migrate applications between Instances

Paybill’s GitSync feature helps to migrate applications between instances by pushing and pulling changes through a Git repository. It supports Git providers such as GitHub, GitLab, Gitea and Bitbucket. For setup instructions, refer to the [GitSync documentation](/docs/development-lifecycle/gitsync/overview).With GitSync, users can effortlessly transfer applications between instances by committing and pushing changes to a shared repository. This ensures that once an application is developed in development instance, it can be easily synchronized with other instances like staging and production.

## Pushing and Pulling Data Between Instances via GitSync

### Pushing Changes

GitSync enables users to commit and push updates from your instance to your Git repository. New data, renames, and version creations are auto-committed and you can also manually commit changes using the GitSync button. Refer to [Push-Gitsync](/docs/development-lifecycle/gitsync/push) doc to learn more.

### Pulling Changes

GitSync allows you to pull updates from a Git repository into your instance. You can import data from Git through the Paybill dashboard. Once pulled, the app will be in view-only mode. You can also check for updates, which fetches the latest commits with details like author and date. If updates are available, you can pull changes and sync them. Refer to [Pull-Gitsync](/docs/development-lifecycle/gitsync/pull) doc to learn more.Here is the diagram showing how you can use gitsync to migrate your data across instances.

<img style={{ marginBottom:'15px' }} className="screenshot-full img-l" src="/img/development-lifecycle/environments/multi-instance.png" alt="self-hosted-env-concept" />
