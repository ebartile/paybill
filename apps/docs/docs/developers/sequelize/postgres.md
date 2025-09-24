---
id: postgresql-schemas
title: PostgreSQL Schemas
---

# PostgreSQL Schemas

This provides enhanced support for PostgreSQL schemas, allowing you to organize your database objects into logical groups.

## Specifying a Schema

You can specify a default schema for your database connection by providing the `schema` option when creating a new `Database` instance.

```typescript
const db = new Database({
  dialect: 'postgres',
  // ... other options
  schema: 'my_app_schema',
});
```

## Automatic Schema Creation

If the specified schema does not exist in the database, it will be automatically created when you call `db.prepare()` or `db.sync()`.

## Collection Scoping

All collections and their corresponding tables will be created within the specified schema. This helps to avoid naming conflicts and keeps your database organized.

## Cleaning a Schema

When you call `db.clean({ drop: true })`, it will drop all tables within the specified schema, effectively resetting it to a clean state.
