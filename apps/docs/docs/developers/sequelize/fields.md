---
id: fields
title: Fields
---

# Fields

This provides a rich set of field types that you can use to define your models.

## Standard Types

### `string`

A basic string field.

-   `length`: Sets the maximum length of the string.
-   `trim`: If `true`, trims whitespace from the beginning and end of the string.

### `text`

A long text field.

-   `length`: Can be `'tiny'`, `'medium'`, or `'long'`.
-   `trim`: If `true`, trims whitespace.

### `array`

A field that can store an array of values.

### `set`

A field that stores an array of unique values.

## ID and Hashing

### `uuid`

Generates a UUID (v4) for the field.

-   `autoFill`: If `false`, a UUID will not be automatically generated.

### `nanoid`

Generates a unique string ID using [Nano ID](https://github.com/ai/nanoid).

-   `size`: The length of the ID.
-   `customAlphabet`: A string of characters to use for generating the ID.
-   `autoFill`: If `false`, an ID will not be automatically generated.

### `password`

Automatically hashes and verifies passwords using bcrypt.

-   The field value is automatically hidden from `toJSON()` output.
-   Provides a `verify(password, hash)` method on the field instance.

### `encryption`

Automatically encrypts and decrypts the field's value.

-   `iv`: A 16-character initialization vector.

## Date and Time

### `dateOnly`

Stores a date without a time component (e.g., `2023-03-24`).

### `datetimeNoTz`

Stores a date and time without a timezone.

-   `defaultToCurrentTime`: If `true`, sets the default value to the current time.
-   `onUpdateToCurrentTime`: If `true`, updates the value to the current time on every update.

### `datetimeTz`

Stores a date and time with a timezone.

-   `timezone`: Can be `'client'`, `'server'`, or a specific timezone offset (e.g., `+06:00`).
-   `defaultToCurrentTime`: If `true`, sets the default value to the current time.
-   `onUpdateToCurrentTime`: If `true`, updates the value to the current time on every update.

### `unixTimestamp`

Stores a date and time as a Unix timestamp.

-   `accuracy`: Can be `'second'` or `'millisecond'`.
-   `timezone`: Can be `'client'`, `'server'`, or a specific timezone offset.

## Relationships

### `belongsTo`

Defines a one-to-one or one-to-many relationship.

-   `target`: The name of the target collection.
-   `foreignKey`: The name of the foreign key column.
-   `targetKey`: The name of the column on the target model to associate with.
-   `onDelete`: The `ON DELETE` behavior (`'CASCADE'`, `'SET NULL'`, `'RESTRICT'`, etc.).

### `hasOne`

Defines a one-to-one relationship.

-   `target`: The name of the target collection.
-   `foreignKey`: The name of the foreign key column.
-   `sourceKey`: The name of the column on the source model to associate with.

### `hasMany`

Defines a one-to-many relationship.

-   `target`: The name of the target collection.
-   `foreignKey`: The name of the foreign key column.
-   `sourceKey`: The name of the column on the source model to associate with.

### `belongsToMany`

Defines a many-to-many relationship.

-   `target`: The name of the target collection.
-   `through`: The name of the join table.
-   `foreignKey`: The name of the foreign key in the join table that points to the source model.
-   `otherKey`: The name of the foreign key in the join table that points to the target model.

## Special

### `context`

A field that gets its value from the context of the request. This is useful for things like storing the IP address of the user who created a record.

-   `dataIndex`: The path to the value in the context object (e.g., `'request.ip'`).
-   `dataType`: The data type of the field (`'string'`, `'integer'`, `'json'`, etc.).
-   `createOnly`: If `true`, the value is only set when the record is created.
