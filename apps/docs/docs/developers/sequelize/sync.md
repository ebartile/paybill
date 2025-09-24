---
id: synchronization
title: Database Synchronization
---

# Database Synchronization

The `db.sync()` method is a powerful tool that synchronizes your database schema with your collection definitions. It handles the creation and modification of tables, columns, indexes, and constraints.

## Basic Usage

To synchronize all collections with the database, simply call `db.sync()`.

```typescript
await db.sync();
```

## How it Works

When you call `db.sync()`, it compares the state of your collections with the state of the database and applies the necessary changes. This includes:

-   **Creating Tables**: If a collection's table doesn't exist in the database, `db.sync()` will create it.
-   **Adding Columns**: If you add a new field to a collection, `db.sync()` will add a corresponding column to the table.
-   **Modifying Columns**: If you change a field's definition (e.g., change its type or default value), `db.sync()` will update the column in the database.
-   **Removing Columns**: If you remove a field from a collection, `db.sync()` will remove the corresponding column from the table.
-   **Managing Indexes**: It creates, modifies, and removes indexes, including unique indexes and indexes for foreign keys.
-   **Managing Primary Keys**: It can set and change the primary key of a table.

## Sync Options

You can pass an options object to `db.sync()` to control its behavior.

```typescript
await db.sync({
  force: false,
  alter: {
    drop: false,
  },
});
```

-   **`force`**: If `true`, it will drop all tables and recreate them. **Warning: This will delete all your data.**
-   **`alter.drop`**: If `false`, it will not drop columns that have been removed from the collection definition.
