---
id: hooks
title: Hooks
---

# Hooks

This provides a powerful hooking system that allows you to listen for events and execute custom logic.

## Listening to Hooks

You can listen to hooks by using the `db.on()` method. The event name is a combination of the collection name and the hook name, separated by a dot.

```typescript
db.on('collectionName.hookName', (arg1, arg2, ...) => {
  // Your custom logic here
});
```

## Available Hooks

You can use any of the standard Sequelize hooks, such as:

-   `beforeValidate`
-   `afterValidate`
-   `beforeCreate`
-   `afterCreate`
-   `beforeDestroy`
-   `afterDestroy`
-   `beforeUpdate`
-   `afterUpdate`
-   `beforeSave`
-   `afterSave`
-   `beforeSync`
-   `afterSync`

### `afterCreateWithAssociations`

This is a custom hook that is triggered after a model and all of its associations have been created. This hook is executed within a transaction, so if an error is thrown within the hook, the entire creation process will be rolled back.

#### Example

```typescript
db.on('test.afterCreateWithAssociations', async (model, { transaction }) => {
  // This code runs after a 'test' model and its associations are created.
  // If this throws an error, the transaction will be rolled back.
  throw new Error('test error');
});
```
