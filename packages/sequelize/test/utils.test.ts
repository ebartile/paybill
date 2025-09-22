import Database, { mockDatabase } from '../src';

describe('database utils', () => {
  let db: Database;

  afterEach(async () => {
    await db.close();
  });

  beforeEach(async () => {
    db = await mockDatabase({});

    await db.clean({ drop: true });
  });

  it('should get database schema', async () => {
    if (!db.inDialect('postgres')) {
      return;
    }
    const schema = 'public';
    expect(db.utils.schema()).toEqual(schema);
  });
});
