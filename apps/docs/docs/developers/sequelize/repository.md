---
id: repository
title: Repository
---

# Repository

The repository is the primary interface for interacting with your collections. It provides a high-level, developer-friendly API for performing CRUD (Create, Read, Update, Delete) operations and more.

## Getting a Repository

You can get a repository for a collection using `db.getRepository('collectionName')`.

```ts
const userRepository = db.getRepository('users');
```

```mermaid
flowchart LR
  A[db] -->|"getRepository('users')"| B[User Repository]
```

## CRUD Operations

### `create(options)`

Creates a single record.

```ts
await userRepository.create({
  values: { name: 'Alice', age: 25 },
});
```

```mermaid
sequenceDiagram
  participant C as Client
  participant R as Repository
  participant DB as Database
  C->>R: create(values)
  R->>DB: INSERT record
  DB-->>R: Created record
  R-->>C: Return record
```

---

### `createMany(options)`

```ts
await userRepository.createMany({
  records: [
    { name: 'Bob', age: 30 },
    { name: 'Carol', age: 40 },
  ],
});
```

```mermaid
flowchart TD
  A[Client] --> B[Repository.createMany]
  B --> C{Insert multiple records}
  C --> D[Database]
```

---

### `find(options)`

```ts
const users = await userRepository.find({
  filter: { 'age.$gt': 20 },
  sort: ['-age'],
  limit: 10,
  appends: ['posts'],
});
```

```mermaid
sequenceDiagram
  Client->>Repository: find(options)
  Repository->>Database: SELECT with filters
  Database-->>Repository: Matching rows
  Repository-->>Client: Return results
```

---

### `findOne(options)`

```ts
const user = await userRepository.findOne({
  filter: { name: 'Alice' },
});
```

```mermaid
flowchart LR
  A[Client] -->|findOne| B[Repository]
  B --> C[(Database)]
  C --> B
  B --> A
```

---

### `update(options)`

```ts
await userRepository.update({
  values: { age: 26 },
  filter: { name: 'Alice' },
});
```

```mermaid
sequenceDiagram
  Client->>Repository: update(values, filter)
  Repository->>Database: UPDATE rows
  Database-->>Repository: Affected count
  Repository-->>Client: Result
```

---

### `updateMany(options)`

```ts
await userRepository.updateMany({
  values: [
    { id: 1, age: 27 },
    { id: 2, age: 35 },
  ],
});
```

```mermaid
flowchart TD
  A[Client] --> B[Repository.updateMany]
  B --> C[Bulk UPDATE]
  C --> D[Database]
```

---

### `destroy(options)`

```ts
await userRepository.destroy({ filterByTk: 1 });
await userRepository.destroy({ filter: { 'age.$gt': 40 } });
await userRepository.destroy({ truncate: true });
```

```mermaid
flowchart TD
  A[Client] --> B[Repository.destroy]
  B -->|DELETE| C[Database]
```

---

## Upserting

### `firstOrCreate(options)`

```ts
const user = await userRepository.firstOrCreate({
  filterKeys: ['email'],
  values: { email: 'test@example.com', name: 'Test User' },
});
```

```mermaid
flowchart TD
  A[Client] --> B[Repository.firstOrCreate]
  B -->|Check exists| C[Database]
  C -->|Found?| B
  B -->|Yes| D[Return record]
  B -->|No| E[Insert new record]
```

---

### `updateOrCreate(options)`

```ts
const user = await userRepository.updateOrCreate({
  filterKeys: ['email'],
  values: { email: 'test@example.com', name: 'Updated User' },
});
```

```mermaid
sequenceDiagram
  Client->>Repository: updateOrCreate
  Repository->>Database: SELECT by filterKeys
  alt Found
    Repository->>Database: UPDATE
  else Not found
    Repository->>Database: INSERT
  end
  Database-->>Repository: Record
  Repository-->>Client: Return record
```

---

## Other Methods

### `count(options)`

```ts
const count = await userRepository.count({
  filter: { 'age.$gte': 18 },
});
```

```mermaid
flowchart LR
  A[Repository.count] --> B["Database: SELECT COUNT(*)"]
  B --> A
```

---

### `getEstimatedRowCount()`

```ts
const estimated = await userRepository.getEstimatedRowCount();
```

```mermaid
flowchart LR
  A[Repository] --> B[Database: Estimated stats]
```

---

### `aggregate(options)`

```ts
const avgAge = await userRepository.aggregate({
  method: 'avg',
  field: 'age',
});
```

```mermaid
flowchart LR
  A[Repository.aggregate] --> B["Database: AVG(age)"]
  B --> A
```

---

### `chunk(options)`

```ts
await userRepository.chunk({
  chunkSize: 100,
  callback: async (users) => {
    console.log('Processing chunk:', users.length);
  },
  limit: 1000,
});
```

```mermaid
flowchart TD
  A[Client] --> B[Repository.chunk]
  B --> C[Fetch chunk of 100]
  C --> D[Callback invoked]
  D --> B
  B -->|Repeat until limit| E[Done]
```
