---
id: field-interfaces
title: Field Interfaces
---

# Field Interfaces

Field interfaces are classes that handle the validation, conversion, and formatting of data for different field types. They are particularly useful for translating data between the database and a user interface.

## Core Concepts

Each interface typically has the following methods:

-   **`validate(value)`**: Checks if a value is valid for the interface.
-   **`toValue(value)`**: Converts a value to a format suitable for the database.
-   **`toString(value)`**: Converts a database value to a string representation for display.

When you define a collection:

```ts
const users = db.collection({
  name: 'users',
  fields: [
    { name: 'email', type: 'input' },
    { name: 'age', type: 'integer' },
    { name: 'role', type: 'select', uiSchema: { enum: ['admin','user'] } },
  ],
});
```

* Each field's `type` references a **registered interface**.
* During field instantiation, the interface ensures the data is validated, converted, and formatted correctly.

## Available Interfaces

### **Primitive / Basic Interfaces**

| Interface Name | Description                                                |
| -------------- | ---------------------------------------------------------- |
| `input`        | Generic input for strings or numbers (`InputInterface`)    |
| `textarea`     | Multi-line text input (`TextareaInterface`)                |
| `integer`      | Integer numbers (`IntegerInterface`)                       |
| `number`       | Floating-point numbers (`NumberInterface`)                 |
| `percent`      | Converts decimal to percentage string (`PercentInterface`) |
| `checkbox`     | Boolean checkbox (`BooleanInterface`)                      |
| `boolean`      | Boolean true/false (`BooleanInterface`)                    |

---

### **Date & Time Interfaces**

| Interface Name  | Description                                            |
| --------------- | ------------------------------------------------------ |
| `date`          | Date-only field (`DateInterface`)                      |
| `time`          | Time-only field (`TimeInterface`)                      |
| `datetime`      | Date + time (`DatetimeInterface`)                      |
| `datetimeNoTz`  | Date + time without timezone (`DatetimeNoTzInterface`) |
| `unixTimestamp` | Epoch timestamp as datetime (`DatetimeInterface`)      |
| `createdAt`     | Auto-tracked creation datetime (`DatetimeInterface`)   |
| `updatedAt`     | Auto-tracked update datetime (`DatetimeInterface`)     |

---

### **Select / Multiple Choice Interfaces**

| Interface Name   | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `select`         | Single select from options (`SelectInterface`)            |
| `radio`          | Single select using radio buttons (`SelectInterface`)     |
| `radioGroup`     | Group of radio buttons (`SelectInterface`)                |
| `multipleSelect` | Multi-select field (`MultipleSelectInterface`)            |
| `checkboxes`     | Multi-checkbox selection (`MultipleSelectInterface`)      |
| `checkboxGroup`  | Alias for multiple checkboxes (`MultipleSelectInterface`) |

---

### **JSON Interface**

| Interface Name | Description                           |
| -------------- | ------------------------------------- |
| `json`         | Stores JSON objects (`JsonInterface`) |

---

### **Relationship Interfaces**

| Interface Name | Description                                               |
| -------------- | --------------------------------------------------------- |
| `oho`          | One-to-one (owner side) (`OneHasOneInterface`)            |
| `obo`          | One-to-one (belongs-to side) (`OneBelongsToOneInterface`) |
| `o2m`          | One-to-many (`OneToManyInterface`)                        |
| `m2o`          | Many-to-one (`ManyToOneInterface`)                        |
| `m2m`          | Many-to-many (`ManyToManyInterface`)                      |


## Custom Interfaces

You can create your own custom interfaces by extending the `BaseInterface` class and registering them with the `InterfaceManager`.

### Example

```typescript
import { BaseInterface } from '@paybilldev/sequelize';

class TestInterface extends BaseInterface {
  toString(value: any) {
    return `test-${value}`;
  }
}

db.interfaceManager.registerInterfaceType('test', TestInterface);
```

### Usage

When you define a collection:

```ts
const users = db.collection({
  name: 'users',
  fields: [
    { name: 'email', type: 'test' },
  ],
});
```
