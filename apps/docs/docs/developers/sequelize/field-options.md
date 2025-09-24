---
id: field-options
title: Field Options
---

# Field Options

This provides several useful options that you can apply to fields to control their behavior.

## `hidden`

The `hidden` option allows you to prevent a field from being included in the JSON output of a model. This is particularly useful for sensitive data, such as passwords, that you don't want to expose to the client.

### Example

```typescript
db.collection({
  name: 'users',
  fields: [
    {
      type: 'string',
      name: 'name',
    },
    {
      type: 'string',
      name: 'password',
      hidden: true, // The password will not be included in toJSON() output
    },
  ],
});
```

The `hidden` option can also be applied to associations.

## `index`

The `index` option allows you to create a database index on a field. This can significantly improve the performance of queries that filter on that field.

### Example

```typescript
db.collection({
  name: 'users',
  fields: [
    {
      type: 'string',
      name: 'email',
      index: true, // Creates an index on the 'email' column
    },
  ],
});
```

## `sortBy`

The `sortBy` option is used on associations to specify the default sort order for eager-loaded records. You can sort by a field in the associated model or even by a field in the `through` table for `belongsToMany` associations.

### Example

```typescript
// Sort posts by title in ascending order
db.collection({
  name: 'users',
  fields: [
    {
      type: 'hasMany',
      name: 'posts',
      sortBy: 'title', // or ['title', 'ASC']
    },
  ],
});

// Sort images by a 'sort' field in the through table in descending order
db.collection({
  name: 'posts',
  fields: [
    {
      type: 'belongsToMany',
      name: 'images',
      through: 'posts_images',
      sortBy: ['-posts_images.sort'], // The '-' prefix indicates descending order
    },
  ],
});
```
