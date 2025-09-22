---
id: github-config
title: Configure Github
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

In this guide, we will explore how to configure GitSync using GitHub as the repository manager. By default GitSync is configured for the **master** branch.

## Setting up Github in Paybill

Role Required: **Admin**

1. **Create a New Repository** <br/>
    Create a new repository on your GitHub. The repository can be public or private. You can also use an existing repository. Make sure that the repository is empty.
    <img className="screenshot-full img-l" src="/img/development-lifecycle/gitsync/github/config/new-repo.png" alt="GitSync" />

2. **Obtain the SSH URL** <br/>
    When a repository is created, GitHub shows a screen with the SSH URL.
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/github/config/ssh.png" alt="GitSync" />

    OR
    
    If you are using an existing repository, then you can obtain the URL by clicking on the **Code** button.
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/github/config/ssh-code.png" alt="GitSync" />

3. Go to the **Admin settings**, and click on the **Configure git** tab. <br/>
    (Example URL - `https://my-company.paybill.dev/_admin/configure-git`)

    <!-- <img style={{ marginBottom:'15px' }} className="screenshot-full" src="/img/gitsync/gitsync-v3.png" alt="GitLab Repo" /> -->

4. Enter the **SSH URL** of the repository in the **Git repo URL** field.

5. Click on the **Generate SSH key** button, and copy the SSH key that is generated. The SSH key is used to authenticate Paybill with the repository.

    There are two types of generated SSH keys:
    - **ED25519**: This is a secure and efficient algorithm that is used for generating SSH keys. It is recommended to use this key type. VCS providers like GitHub and GitLab recommend using this key type
    - **RSA**: This is an older algorithm that is used for generating SSH keys. It is not recommended to use this key type. Providers like Bitbucket recommend using this key type. <br/> <br/>

    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/ssh-key.png" alt="GitSync" />

6. Enable Deploy Key, click on the **Org Settings** button.
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/github/config/deploy_keys.png" alt="Enable Deploy Keys" />

7. Go to the **Project Settings** tab of the GitHub repository, and click on the **Deploy keys** tab. Click on the **Add deploy key** button. 
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/github/config/deploy-ssh.png" alt="GitSync" />

8. Enter a title for the SSH key in the **Title** field. 
        
9. Paste the SSH key generated from the Paybill. 

10. Make sure that the **Allow write access** checkbox is checked, especially when configuring the GitSync feature to [push changes to Git](/docs/development-lifecycle/gitsync/push). However, it is not mandatory to check this option when setting up the GitSync feature for [pulling changes from Git](/docs/development-lifecycle/gitsync/pull).

11. Finally, click on the **Add key** button.
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/github/config/add-key.png" alt="GitSync" />

    To deploy the SSH key for other git repository manager, such as GitLab and Gitea, follow the **[SSH Configuration](/docs/development-lifecycle/gitsync/ssh-config#deploy-the-ssh-key)** guide.

12. After deploying the SSH Key, go to the **Configure git** tab on Paybill, and click on the **Finalize setup** button. If the SSH key is configured correctly, you will see a success message.
    <!-- <img className="screenshot-full" src="/img/development-lifecycle/gitsync/github/config/save-config.png" alt="GitSync" /> -->
