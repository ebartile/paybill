---
id: gitlab-config
title: Configure Gitlab
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

In this guide, we will explore how to configure GitSync using Gitlab as the repository manager. By default GitSync is configured for the **master** branch.

## Setting up Gitlab in Paybill

Role Required: **Admin**

1. **Create a New Repository** <br/>
    Create a new repository on your Gitlab. The repository can be public or private. You can also use an existing repository. Make sure that the repository is empty.
    <img className="screenshot-full img-l" src="/img/development-lifecycle/gitsync/gitlab/config/new-repo.png" alt="GitSync" />

2. **Obtain the SSH URL** <br/>
    When a repository is created, Gitlab shows a screen with the SSH URL.
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/gitlab/config/ssh.png" alt="GitSync" />

3. Go to the **Admin settings**, and click on the **Configure git** tab. <br/>
    (Example URL - `https://my-company.paybill.dev/_admin/configure-git`)

    <!-- <img style={{ marginBottom:'15px' }} className="screenshot-full" src="/img/gitsync/gitsync-v3.png" alt="GitLab Repo" /> -->

4. Enter the **SSH URL** of the repository in the **Git repo URL** field.

5. Click on the **Generate SSH key** button, and copy the SSH key that is generated. The SSH key is used to authenticate Paybill with the repository.

    There are two types of generated SSH keys:
    - **ED25519**: This is a secure and efficient algorithm that is used for generating SSH keys. It is recommended to use this key type. VCS providers like GitHub and GitLab recommend using this key type
    - **RSA**: This is an older algorithm that is used for generating SSH keys. It is not recommended to use this key type. Providers like Bitbucket recommend using this key type. <br/> <br/>

    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/ssh-key.png" alt="GitSync" />

You have two options for adding the SSH key to GitLab, you can either add it globally to access all your repositories or deploy it for a specific repository.

#### Option 1: Add as a User-Wide SSH Key
        
Use this option for access to all your repositories.

1. Click on your avatar in the top-left corner and select **Edit Profile**.

2. Navigate to the **SSH Keys** tab and click the **Add new key** button.
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/gitlab/config/addingssh.png" alt="GitLab SSH Key" />

3. In the **Key** field, paste the SSH key you generated from the Paybill.

4. Give your key a descriptive title.
        
5. Set **Usage type** to **Authentication & signing**.
        
6. Optionally, set an expiration date.
        
7. Click **Add key** to save.
    <img style={{marginBottom:'15px'}} className="screenshot-full" src="/img/development-lifecycle/gitsync/gitlab/config/activessh.png" alt="GitLab SSH Key" />

#### Option 2: Add as a Deploy Key 

Use this option for access to a specific repository only.

1. Navigate to the repository you want to add the key to.
        
2. Click on the **Settings** tab and select **Repository**.

3. Once you are in the **Repository Settings**, expand the **Deploy Keys** section.
        
4. Click on the **Add new deploy key** button.

5. Give your key a descriptive title.

6. In the **Key** field, paste the SSH key you generated in Paybill's Configure Git tab during the previous step.

7. Enable the **Grant write permissions to this key** checkbox. We need this permission to push changes to the repository.

8. Click **Add key** to save.
    <img className="screenshot-full" src="/img/development-lifecycle/gitsync/gitlab/config/deploy-keys.png" alt="GitLab Deploy Key" />

12. After deploying the SSH Key, go to the **Configure git** tab on Paybill, and click on the **Finalize setup** button. If the SSH key is configured correctly, you will see a success message.
    <!-- <img className="screenshot-full" src="/img/development-lifecycle/gitsync/gitlab/config/save-config.png" alt="GitSync" /> -->
