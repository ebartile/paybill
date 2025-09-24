import { BaseDialect, Database, mockDatabase } from '../../src';
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe('dialect extend', () => {
  let db: Database;

  beforeEach(async () => {
    db = await mockDatabase();
    await db.clean({ drop: true });
  });

  afterEach(async () => {
    await db.close();
  });

  it('should register dialect', async () => {
    class SubDialect extends BaseDialect {
      static dialectName = 'test';

      async checkDatabaseVersion(db: Database): Promise<boolean> {
        return true;
      }
    }

    Database.registerDialect(SubDialect);
    expect(Database.getDialect('test')).toBe(SubDialect);
  });
});
