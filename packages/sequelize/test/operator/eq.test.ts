import { mockDatabase, Database } from '../../src';
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe('eq operator', () => {
  let db: Database;
  let Test;

  beforeEach(async () => {
    db = await mockDatabase({});
    await db.clean({ drop: true });

    Test = db.collection({
      name: 'tests',
      fields: [{ type: 'string', name: 'name' }],
    });

    await db.sync();
  });

  afterEach(async () => {
    await db.close();
  });

  it('should eq with array', async () => {
    await db.getRepository('tests').create({
      values: [{ name: '123' }, { name: '234' }, { name: '345' }],
    });

    const results = await db.getRepository('tests').count({
      filter: {
        'name.$eq': ['123', '234'],
      },
    });

    expect(results).toEqual(2);
  });

  it('should eq with array', async () => {
    await db.getRepository('tests').create({
      values: [{ name: '123' }, { name: '234' }, { name: '345' }],
    });

    const results = await db.getRepository('tests').count({
      filter: {
        'name.$eq': '123',
      },
    });

    expect(results).toEqual(1);
  });

  it('should eq with array', async () => {
    await db.getRepository('tests').create({
      values: [{ name: '123' }, { name: '234' }, { name: '345' }],
    });

    const results = await db.getRepository('tests').count({
      filter: {
        'name.$eq': '456',
      },
    });

    expect(results).toEqual(0);
  });

  it('should eq string field with number value', async () => {
    await db.getRepository('tests').create({
      values: [{ name: '123' }, { name: '234' }, { name: '345' }],
    });

    const results = await db.getRepository('tests').count({
      filter: {
        'name.$eq': 123,
      },
    });

    expect(results).toEqual(1);
  });

  it('should eq string field with number value (array)', async () => {
    await db.getRepository('tests').create({
      values: [{ name: '123' }, { name: '234' }, { name: '345' }],
    });

    const results = await db.getRepository('tests').count({
      filter: {
        'name.$eq': [123],
      },
    });

    expect(results).toEqual(1);
  });
});
