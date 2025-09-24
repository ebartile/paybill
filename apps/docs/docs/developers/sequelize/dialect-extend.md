---
id: dialect-extend
title: Dialect Extend
---

# Dialect Extend

This allows you to extend its functionality by registering custom dialects. This is useful when you need to support a database that is not supported out-of-the-box, or when you want to customize the behavior of an existing dialect.

## Registering a Custom Dialect

To register a custom dialect, you need to create a class that extends `BaseDialect` and then use the `Database.registerDialect()` method.

Your custom dialect class must have a static `dialectName` property and an `async checkDatabaseVersion(db: Database): Promise<boolean>` method.

### Example

Here is an example of how to register a custom dialect:

```typescript
import { BaseDialect, Database } from '@paybilldev/sequelize';

class SubDialect extends BaseDialect {
  static dialectName = 'test';

  async checkDatabaseVersion(db: Database): Promise<boolean> {
    return true;
  }
}

Database.registerDialect(SubDialect);
```

After registering your custom dialect, you can use it when creating a new `Database` instance by specifying the `dialectName` in the options.
