---
id: miscellaneous
title: Miscellaneous
---

# Miscellaneous Topics

This page covers a variety of topics and features of this custom Sequelize implementation that don't fit into the other categories.

## BigInt Support

The database has built-in support for `bigint` data types. It automatically handles the conversion between JavaScript's `BigInt` and the database's `bigint` type. When a `bigint` value is smaller than `Number.MAX_SAFE_INTEGER`, it is returned as a `number`; otherwise, it is returned as a `string`.

## Collection Factory

The `CollectionFactory` allows you to register custom collection types. This is useful for extending the functionality of collections with your own custom logic.

### Example

```typescript
class ChildCollection extends Collection {
  static type = 'child';
}

db.collectionFactory.registerCollectionType(ChildCollection, {
  condition: (options) => options.child,
});

const collection = db.collectionFactory.createCollection({
  name: 'child',
  child: true,
});

// collection is now an instance of ChildCollection
```

## Collection Importer

The `ImporterReader` class allows you to import collection definitions from a directory of files. This is a convenient way to organize your collection definitions.

```typescript
await db.import({
  directory: path.resolve(__dirname, './collections'),
});
```

## Database Operations

The `Database` class provides several useful methods:

-   `getRepository(path, sourceId)`: Gets a repository for a collection or a relation.
-   `getCollection(name)`: Gets a collection by name.
-   `hasCollection(name)`: Checks if a collection exists.
-   `on(event, listener)` / `off(event, listener)`: For listening to global and collection-specific events.

## Filtering

-   **`filterMatch(record, filter)`**: A utility function for checking if a record matches a filter object on the client-side.
-   **`FilterParser`**: A class that parses a filter object and converts it into Sequelize query parameters.

## Grouping

You can use the `group` option in `repository.find()` to group the results by one or more columns.

```typescript
const result = await repository.find({
  attributes: ['status', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
  group: 'status',
});
```

## Magic Attribute Model

The `MagicAttributeModel` is a special model that allows you to store and retrieve nested JSON data as if they were top-level attributes of the model.

-   `magicAttribute`: The name of the JSON field to use for storing the magic attributes (defaults to `'options'`).

## Migrations

The `Migrator` class provides a way to manage database schema changes over time.

-   `db.addMigrations({ directory, namespace })`: Adds migrations from a directory.
-   `db.addMigration({ name, migration })`: Adds a single migration.
-   `db.migrator.up()`: Runs all pending migrations.
-   `db.migrator.down()`: Reverts the last executed migration.

## Sorting

When sorting, `null` values are always placed last, regardless of the sort order (ASC or DESC).

## Underscored Option

The `underscored` option, which can be set at the database or collection level, controls the naming convention for tables and columns. If `true`, it will convert camelCase names to snake_case.

## Update Guard

The `UpdateGuard` class provides a way to control which fields can be updated on a model.

-   `setWhiteList(fields)`: Only allows the specified fields to be updated.
-   `setBlackList(fields)`: Prevents the specified fields from being updated.
-   `setAssociationKeysToBeUpdate(associations)`: Specifies which associations should be updated.
