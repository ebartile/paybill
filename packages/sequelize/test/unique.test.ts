import { mockDatabase, Database } from '../src';
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe('unique field', () => {
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

  it('should not transform empty string to null when field is not unique', async () => {
    const User = db.collection({
      name: 'users',
      fields: [
        {
          type: 'string',
          name: 'name',
        },
      ],
    });

    await db.sync();

    await User.repository.create({
      values: [
        {},
        {
          name: '',
        },
        {
          name: 'user3',
        },
      ],
    });

    const u3 = await User.repository.findOne({
      filter: {
        name: 'user3',
      },
    });

    await User.repository.update({
      filter: {
        id: u3.id,
      },
      values: {
        name: '',
      },
    });

    await u3.reload();
    expect(u3.get('name')).toBe('');
  });

  it('should transform empty string to null when field is unique', async () => {
    const User = db.collection({
      name: 'users',
      fields: [
        {
          type: 'string',
          name: 'name',
          unique: true,
        },
      ],
    });

    await db.sync();

    await User.repository.create({
      values: [
        {},
        {
          name: '',
        },
        {
          name: 'user3',
        },
      ],
    });

    const u3 = await User.repository.findOne({
      filter: {
        name: 'user3',
      },
    });

    let error;

    try {
      await User.repository.update({
        filter: {
          id: u3.id,
        },
        values: {
          name: '',
        },
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();

    await u3.reload();
    expect(u3.get('name')).toBe(null);
  });
});
