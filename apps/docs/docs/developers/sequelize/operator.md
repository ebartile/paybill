---
id: filter-operators
title: Filter Operators
---

# Filter Operators

This provides a rich set of filter operators that you can use to build complex queries.

## Generic Operators

| Operator | Description             | Example                                   |
| -------- | ----------------------- | ----------------------------------------- |
| `$eq`    | Equal to                | `{ 'name.$eq': 'John' }`                  |
| `$ne`    | Not equal to            | `{ 'age.$ne': 21 }`                       |
| `$in`    | In a list of values     | `{ 'status.$in': ['active', 'pending'] }` |
| `$notIn` | Not in a list of values | `{ 'country.$notIn': ['USA', 'Canada'] }` |

## String Operators

| Operator         | Description                          | Example                               |
| ---------------- | ------------------------------------ | ------------------------------------- |
| `$includes`      | Contains the given substring         | `{ 'title.$includes': 'Sequelize' }`  |
| `$notIncludes`   | Does not contain the given substring | `{ 'title.$notIncludes': 'MongoDB' }` |
| `$startsWith`    | Starts with the given string         | `{ 'username.$startsWith': 'admin' }` |
| `$notStartsWith` | Does not start with the given string | `{ 'email.$notStartsWith': 'test' }`  |
| `$endWith`       | Ends with the given string           | `{ 'file.$endWith': '.pdf' }`         |
| `$notEndWith`    | Does not end with the given string   | `{ 'domain.$notEndWith': '.com' }`    |
| `$empty`         | The string is empty (`''`) or `null` | `{ 'description.$empty': true }`      |
| `$notEmpty`      | The string is not empty              | `{ 'description.$notEmpty': true }`   |

## Array Operators

These operators are for fields of type `array` or `set`.

| Operator    | Description                                                  | Example                                               |
| ----------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| `$match`    | The array is equal to the given array (order doesn't matter) | `{ 'tags.$match': ['nodejs', 'sequelize'] }`          |
| `$notMatch` | The array is not equal to the given array                    | `{ 'tags.$notMatch': ['java', 'spring'] }`            |
| `$anyOf`    | The array contains at least one of the given values          | `{ 'categories.$anyOf': ['backend', 'frontend'] }`    |
| `$noneOf`   | The array contains none of the given values                  | `{ 'flags.$noneOf': ['deprecated', 'experimental'] }` |
| `$empty`    | The array is empty (`[]`) or `null`                          | `{ 'collaborators.$empty': true }`                    |
| `$notEmpty` | The array is not empty                                       | `{ 'collaborators.$notEmpty': true }`                 |

## Association Operators

These operators are for filtering based on the existence of associated records.

| Operator     | Description                                   | Example                           |
| ------------ | --------------------------------------------- | --------------------------------- |
| `$exists`    | The record has at least one associated record | `{ 'posts.$exists': true }`       |
| `$notExists` | The record has no associated records          | `{ 'comments.$notExists': true }` |

## Boolean Operators

| Operator   | Description          | Example                           |
| ---------- | -------------------- | --------------------------------- |
| `$isFalsy` | The value is `false` | `{ 'isActive.$isFalsy': true }`   |
| `$isTruly` | The value is `true`  | `{ 'isVerified.$isTruly': true }` |

## Date Operators

These operators provide a convenient way to filter by date, regardless of the underlying date/time field type (`dateOnly`, `datetimeNoTz`, `datetimeTz`, `unixTimestamp`).

| Operator         | Description                                              | Example                                                      |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| `$dateOn`        | The date is on the given day                             | `{ 'createdAt.$dateOn': '2023-03-24' }`                      |
| `$dateNotOn`     | The date is not on the given day                         | `{ 'updatedAt.$dateNotOn': '2023-03-24' }`                   |
| `$dateBefore`    | The date is before the given day                         | `{ 'publishedAt.$dateBefore': '2023-01-01' }`                |
| `$dateNotBefore` | The date is not before the given day (i.e., on or after) | `{ 'expiresAt.$dateNotBefore': '2024-01-01' }`               |
| `$dateAfter`     | The date is after the given day                          | `{ 'startDate.$dateAfter': '2023-01-01' }`                   |
| `$dateNotAfter`  | The date is not after the given day (i.e., on or before) | `{ 'endDate.$dateNotAfter': '2023-12-31' }`                  |
| `$dateBetween`   | The date is between two given dates (inclusive)          | `{ 'createdAt.$dateBetween': ['2023-01-01', '2023-03-31'] }` |

## Example of Implementation

To use filter operators in your code, you can apply them via the `filter` option when querying a collection. Here’s a general example:

```ts
const Test = db.collection({
  name: 'tests',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'tags', type: 'array' },
    { name: 'createdAt', type: 'datetimeNoTz' },
  ],
});

const repository: Repository = Test.repository;
await db.sync();

// Example query using filter operators
const results = await repository.find({
  filter: {
    'name.$eq': 'John',
    'tags.$anyOf': ['backend', 'frontend'],
    'createdAt.$dateBetween': ['2023-01-01', '2023-03-31'],
  },
});
```

This approach works for **any operator type** (generic, string, array, association, boolean, date). You can combine multiple filters using `$and` or `$or` if needed:

```ts
const results = await repository.find({
  filter: {
    $and: [
      { 'name.$includes': 'admin' },
      { 'tags.$notEmpty': true },
    ],
  },
});
```
