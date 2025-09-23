<p align="center">
  <a href="https://paybilldev" target="blank"><img src="https://paybill.dev/logo-wordmark--dark.png" width="180" alt="Paybill Logo" /></a>
</p>

<p align="center">
  Paybill is an open-source Saleforce Alternative for developing cloud-native enterprise applications, utilizing prebuilt standardized architectures for deployment on private and public clouds.
</p>

# @paybilldev/acl

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![Node.js Version](https://img.shields.io/node/v/@paybilldev/acl.svg?style=flat)](https://nodejs.org/en/download/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/paybilldev/paybill)

[npm-image]: https://img.shields.io/npm/v/@paybilldev/acl.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@paybilldev/acl
[download-image]: https://img.shields.io/npm/dm/@paybilldev/acl.svg?style=flat-square
[download-url]: https://npmjs.org/package/@paybilldev/acl

# ACL (Access Control List) 

The ACL system is used to **control who can do what** in your application. Think of it as a rules engine for permissions: you define roles, actions, and conditions, and the system enforces these rules at runtime.


**Key Concepts:**

* **Roles** – A role represents a set of permissions. Example: `admin`, `editor`, `viewer`.
* **Actions** – Things users can do. Example: `create`, `edit`, `delete`, `view`.
* **Resources** – Objects these actions apply to. Example: `posts`, `documents`, `collections`.
* **Strategies** – Predefined sets of permissions that can be applied to roles.
* **Snippets** – Reusable permission groups to avoid repeating the same actions across roles.

**Constructor Example:**

```ts
const acl = new ACL({ currentUser: 'user-123', currentRole: 'admin' });
```

* `currentUser` – Who is currently logged in.
* `currentRole` – The role currently active for permission checks.

---

## 2. Available Actions (`ACLAvailableAction`)

An **action** is anything a user can do. Each action can have:

* A **type** (metadata, e.g., `new-data` or `old-data`)
* **Aliases** – Alternative names for the same action (`edit` and `update`).

```ts
acl.setAvailableAction('create', { type: 'new-data' });
acl.setAvailableAction('edit', { aliases: ['update'] });
```

* Later, when checking permissions, you can use either the original name or its alias.

**Why it matters:** Actions allow the system to know exactly what is being requested, and optional aliases make coding easier.

---

## 3. Roles (`ACLRole`)

A **role** is a collection of permissions (actions on resources). You can define:

* Actions allowed or denied
* Filters restricting which data can be accessed
* Ownership rules (`own: true` to restrict to user-owned resources)
* Strategies and snippets

```ts
acl.define({
  role: 'admin',
  actions: {
    'posts:create': {},
    'posts:edit': { own: true },
    'posts:view': { filter: { status: 'published' } }
  }
});
```

* `own: true` – Only allows editing posts that the current user created
* `filter` – Restrict queries, e.g., only `published` posts

You can also **directly grant or revoke actions**:

```ts
const adminRole = acl.getRole('admin');
adminRole.grantAction('posts:create', {});
adminRole.revokeAction('posts:create');
```

---

## 4. Strategies (`ACLAvailableStrategy`)

**Strategies** are reusable **permission templates**.

* Instead of defining the same actions for multiple roles, you define a strategy once.
* Then, roles can **reference the strategy**.

```ts
acl.setAvailableStrategy('editor', { actions: ['posts:view', 'posts:edit'] });

acl.define({
  role: 'editor',
  strategy: 'editor'
});
```

* `actions: '*'` → All actions allowed
* `actions: false` → All actions denied
* `strategyResources` → Limit strategy to specific resources

**Why it matters:** Strategies avoid duplication and make permission management consistent.

---

## 5. Checking Permissions (`ACL.can`)

The ACL system allows you to **check if a role (or multiple roles) can perform a certain action**.

```ts
const canEdit = acl.can({ role: 'admin', resource: 'posts', action: 'edit' });
```

* Returns a detailed object with `params` including filters, whitelists, and appends.
* Returns `null` if the action is **not allowed**.

**Multiple roles:**

```ts
const canView = acl.can({ roles: ['editor', 'moderator'], resource: 'posts', action: 'view' });
```

* Merges filters with `$or`
* Combines fields, whitelists, and appends without duplicates

**Why it matters:** This is the main function to **enforce access control** in your app.

---

## 6. Dynamic Permissions (`AllowManager`)

`AllowManager` is a **helper for runtime permissions**. It allows you to **grant permissions conditionally**:

```ts
acl.allowManager.allow('documents', 'read'); // always allow
acl.allowManager.allow('documents', 'edit', ctx => ctx.user === 'admin'); // conditional
```

* Supports `"*"` for all actions on a resource
* Conditions can be **functions** that return `true/false` at runtime

**Why it matters:** Some permissions depend on runtime data (like the current user, organization, or time). `AllowManager` handles these cases.

---

## 7. Fixed Parameters (`FixedParamsManager`)

This manager **automatically adds query parameters** when checking permissions.

```ts
acl.addFixedParams('collections', 'destroy', () => ({
  filter: { 'name.$ne': 'users' }
}));
```

* Ensures some restrictions are always applied (e.g., cannot delete critical resources)
* Multiple param functions are combined using `$and`

**Why it matters:** Guarantees rules like “never delete users” are enforced consistently.

---

## 8. Snippets (`SnippetManager`)

Snippets allow **reusable sets of actions**. Think of them as macros for permissions.

```ts
acl.registerSnippet({
  name: 'sc.collection-manager.fields',
  actions: ['fields:list', 'gi:list']
});

const adminRole = acl.define({ role: 'admin' });
adminRole.snippets.add('sc.*'); // apply snippet with wildcard
```

* Supports wildcards (`*`) and negation (`!`)
* Check if a snippet allows an action:

```ts
adminRole.snippetAllowed('fields:list'); // true/false
```

**Why it matters:** Helps keep permission definitions DRY (Don’t Repeat Yourself).

---

## 9. Event Hooks (`beforeGrantAction`)

ACL allows **modifying permissions dynamically** before granting an action:

```ts
acl.beforeGrantAction(ctx => {
  if (ctx.params?.own) {
    ctx.params.filter = { createdById: acl.getCurrentUser() };
  }
});
```

* `ctx` includes: `role`, `resourceName`, `actionName`, `params`
* Useful for dynamic filters, logging, or conditional checks

---

## 10. Current User and Role Helpers

```ts
acl.getCurrentUser(); // get the logged-in user
acl.setCurrentUser('user-456');

acl.getCurrentRole(); // get the active role
acl.setCurrentRole('editor');
```

* Makes it easy to **access runtime context** inside filters, snippets, and conditions.

---

✅ **Summary:**

The ACL system is **modular, flexible, and fully dynamic**. Developers can:

* Define roles and actions
* Use strategies and snippets for reusability
* Merge multiple roles for a user
* Dynamically allow actions at runtime
* Automatically enforce fixed rules 
* Customize filtering, whitelists, and conditions


## License

AGPL

