---
id: field-repository
title: Field Repository
---

# Field Repository

The `ArrayFieldRepository` provides a convenient way to manipulate array-like fields, such as fields with the `set` type. It offers a simple API for adding, removing, setting, and toggling elements within the array.

## Usage

To use the `ArrayFieldRepository`, you first need to create an instance of it, providing the collection, the name of the field, and the ID of the record you want to modify.

```typescript
import { ArrayFieldRepository } from "@paybilldev/sequelize";

const fieldRepository = new ArrayFieldRepository(TestCollection, 'set-field', recordId);
```

### Methods

-   **`add(options)`**: Adds one or more items to the array.
    ```typescript
    await fieldRepository.add({ values: 'a' });
    await fieldRepository.add({ values: ['b', 'c'] });
    ```

-   **`remove(options)`**: Removes one or more items from the array.
    ```typescript
    await fieldRepository.remove({ values: ['c'] });
    ```

-   **`set(options)`**: Replaces all existing items in the array with a new set of items.
    ```typescript
    await fieldRepository.set({ values: ['d', 'e'] });
    ```

-   **`toggle(options)`**: Adds an item to the array if it doesn't exist, or removes it if it does.
    ```typescript
    await fieldRepository.toggle({ value: 'c' });
    ```

-   **`get()`**: Retrieves the current items in the array.
    ```typescript
    const items = await fieldRepository.get();
    ```
