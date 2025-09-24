---
id: query-interface-extensions
title: Query Interface Extensions
---

# Query Interface Extensions

The Query Interface provides low-level methods for interacting with the database.  
These extensions add extra functionality on top of the standard query interface, making it easier to inspect and manage database tables directly.

---

## `showTableDefinition(options)`

Retrieves the definition (schema) of a table from the database.  
This is especially useful when dealing with **reserved words** as table names (e.g., `interval`, `order`).

**Options**

- `options.tableName` *(string, required)* – The name of the table.

**Returns**  
A database-specific representation of the table’s definition (columns, constraints, etc.).

**Example**

```ts
const tableDef = await db.queryInterface.showTableDefinition({
  tableName: 'users',
});

console.log(tableDef);
// → Information about the "users" table schema
```

## `getAutoIncrementInfo(options)`

Retrieves information about an auto-incrementing column in a table.
This is useful when you need to **inspect the current state of a sequence** (e.g., for debugging or custom migrations).

**Options**

* `options.tableInfo` *(object, required)*

  * `tableName` *(string)* – Name of the table.
  * `schema` *(string, optional)* – Schema name (PostgreSQL only).
* `options.fieldName` *(string, required)* – The name of the auto-increment column.

**Returns**
An object with:

* `currentVal` *(number)* – The current value of the sequence.
* `seqName` *(string, PostgreSQL only)* – The sequence name backing the auto-increment column.

**Example**

```ts
const incrInfo = await db.queryInterface.getAutoIncrementInfo({
  tableInfo: {
    tableName: 'users',
    schema: 'public', // PostgreSQL only
  },
  fieldName: 'id',
});

console.log(incrInfo.currentVal); // e.g. 5
console.log(incrInfo.seqName);    // e.g. "users_id_seq"
```

## `setAutoIncrementVal(options)`

Manually sets the **next value** of an auto-increment column.
This is useful if you need to reset or advance sequences, for example, after bulk inserts, data imports, or manual ID adjustments.

**Options**

* `options.tableInfo` *(object, required)*

  * `tableName` *(string)* – Name of the table.
  * `schema` *(string, optional)* – Schema name (PostgreSQL only).
* `options.columnName` *(string, required)* – The auto-increment column name.
* `options.currentVal` *(number, required)* – The value to set as the sequence’s **next number**.
* `options.seqName` *(string, PostgreSQL only)* – The sequence name.

**Example**

```ts
await db.queryInterface.setAutoIncrementVal({
  tableInfo: {
    tableName: 'users',
    schema: 'public', // PostgreSQL only
  },
  columnName: 'id',
  currentVal: 100, // Next inserted row will start from here
  seqName: incrInfo.seqName, // Required for PostgreSQL
});

// Insert a new row, its ID will now start from 100+
```

## When to Use These Methods

* **`showTableDefinition`** → Inspect table schemas dynamically.
* **`getAutoIncrementInfo`** → Debug or check the next value of a sequence.
* **`setAutoIncrementVal`** → Reset or adjust sequences after manual operations.

These methods are **advanced utilities**. They’re most useful in database tooling, migrations, or when you need fine-grained control over table definitions and sequences.
