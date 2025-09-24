import { mockDatabase, Database } from '../../src';
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe('mysql', () => {
  let db: Database;

  beforeEach(async () => {
    db = await mockDatabase({
      logging: console.log,
    });

    await db.clean({ drop: true });
  });

  afterEach(async () => {
    await db.close();
  });

  it('should show table def table name has reserved word', async () => {
    if(!db.inDialect('mysql')) return;
    const User = db.collection({
      name: 'users',
      tableName: `interval`,
      fields: [
        {
          type: 'string',
          name: 'name',
        },
      ],
    });

    await db.sync();

    const tableDef = await db.queryInterface.showTableDefinition({
      tableName: User.options.tableName,
    });

    expect(tableDef).toBeDefined();
  });
});

describe('query interface', () => {
  let db: Database;

  beforeEach(async () => {
    db = await mockDatabase({
      logging: console.log,
    });

    await db.clean({ drop: true });
  });

  afterEach(async () => {
    await db.close();
  });

  it('should get auto incr info', async () => {
    const User = db.collection({
      name: 'users',
      autoGenId: false,
      fields: [
        {
          type: 'bigInt',
          name: 'id',
          primaryKey: true,
          autoIncrement: true,
        },
        {
          type: 'string',
          name: 'name',
        },
      ],
    });

    await db.sync();

    await User.repository.create({
      values: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
    });

    const incrInfo = await db.queryInterface.getAutoIncrementInfo({
      tableInfo: {
        tableName: User.model.tableName,
        schema: db.inDialect('postgres') ? User.options.schema || 'public' : undefined,
      },
      fieldName: 'id',
    });

    if (db.isMySQLCompatibleDialect()) {
      expect(incrInfo.currentVal).toBe(4);
    } else {
      expect(incrInfo.currentVal).toBe(3);
    }

    await db.queryInterface.setAutoIncrementVal({
      tableInfo: {
        tableName: User.model.tableName,
        schema: db.inDialect('postgres') ? User.options.schema || 'public' : undefined,
      },
      columnName: 'id',
      currentVal: 100,
      seqName: incrInfo.seqName,
    });

    const userD = await User.repository.create({
      values: {
        name: 'd',
      },
    });

    if (db.isMySQLCompatibleDialect()) {
      expect(userD.id).toBe(100);
    } else {
      expect(userD.id).toBe(101);
    }
  });
});
