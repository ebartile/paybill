---
id: overview
title: GitSync Overview
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

The GitSync feature in Paybill allows seamless synchronization of workspace applications with a Git repository which can be used for environment migration, and backup management. It supports both cloud-based and self-hosted Git providers offering flexibility in managing application development and deployment.

## Key Use-Cases

### Application Migration

GitSync can be used to facilitate the movement of application across different Paybill instances such as from development to staging to production. Users can effortlessly transfer their applications across instances by pushing changes to a Git repository. This means that once an application is developed in one instance, it can be easily moved to another by simply syncing with the repository, ensuring a smooth transition without the need for manual configurations. Refer to the **[github multi-instance](/docs/development-lifecycle/gitsync/github-config)**, **[gitlab multi-instance](/docs/development-lifecycle/gitsync/gitlab-config)** and **[gitea multi-instance](/docs/development-lifecycle/gitsync/gitea-config)** guide for detailed steps.

### Backup Application

GitSync provides a straightforward solution for creating backups of your applications. By pushing changes to a Git repository, users can ensure a secure and versioned history of their application. This serves as a reliable backup mechanism, safeguarding against accidental application/version deletion or corruption. Refer to **[GitSync Backup](/docs/development-lifecycle/backup/gitsync-backup)** guide for more information.