---
id: gitea-config
title: Configure Gitea
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

In this guide, we will explore how to configure GitSync using Gitea as the repository manager. By default GitSync is configured for the **master** branch.

## Setting up Gitea in Paybill

Role Required: **Admin**

1. **Create a New Repository** <br/>
    Create a new repository on your Gitea. The repository can be public or private. You can also use an existing repository. Make sure that the repository is empty.
    <img className="screenshot-full img-l" src="/img/development-lifecycle/gitsync/gitea/config/new-repo.png" alt="GitSync" />

2. **Obtain the SSH URL** <br/>
    When a repository is created, Gitea shows a screen with the SSH URL.
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/gitea/config/ssh.png" alt="GitSync" />


3. Go to the **Admin settings**, and click on the **Configure git** tab. <br/>
    (Example URL - `https://my-company.paybill.dev/_admin/configure-git`)

    <!-- <img style={{ marginBottom:'15px' }} className="screenshot-full" src="/img/gitsync/gitsync-v3.png" alt="GitLab Repo" /> -->

4. Enter the **SSH URL** of the repository in the **Git repo URL** field.

5. Click on the **Generate SSH key** button, and copy the SSH key that is generated. The SSH key is used to authenticate Paybill with the repository.

    There are two types of generated SSH keys:
    - **ED25519**: This is a secure and efficient algorithm that is used for generating SSH keys. It is recommended to use this key type. VCS providers like GitHub and GitLab recommend using this key type
    - **RSA**: This is an older algorithm that is used for generating SSH keys. It is not recommended to use this key type. Providers like Bitbucket recommend using this key type. <br/> <br/>

    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/ssh-key.png" alt="GitSync" />

6. Go to the **Settings** tab of the Gitea repository, and click on the **Deploy keys** tab. Click on the **Add deploy key** button. 
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/gitea/config/deploy-ssh.png" alt="GitSync" />

7. Enter a title for the SSH key in the **Title** field. 
        
8. Paste the SSH key generated from the Paybill. 

9. Make sure that the **Allow write access** checkbox is checked, especially when configuring the GitSync feature to [push changes to Git](/docs/development-lifecycle/gitsync/push). However, it is not mandatory to check this option when setting up the GitSync feature for [pulling changes from Git](/docs/development-lifecycle/gitsync/pull).
        
10. Finally, click on the **Add Deploy key** button.
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/gitlab/config/final.png" alt="GitSync" />


11. After deploying the SSH Key, go to the **Configure git** tab on Paybill, and click on the **Finalize setup** button. If the SSH key is configured correctly, you will see a success message.
    <!-- <img className="screenshot-full" src="/img/development-lifecycle/gitsync/gitea/config/save-config.png" alt="GitSync" /> -->
