import { Database, mockDatabase } from '../../src';

describe('association references', () => {
  let db: Database;

  beforeEach(async () => {
    db = await mockDatabase();

    await db.clean({ drop: true });
  });

  afterEach(async () => {
    await db.close();
  });

  it('should add reference with default priority', async () => {
    db.collection({
      name: 'users',
      fields: [{ type: 'hasOne', name: 'profile' }],
    });

    db.collection({
      name: 'profiles',
      fields: [{ type: 'belongsTo', name: 'user' }],
    });

    await db.sync();

    const references = db.referenceMap.getReferences('users');

    expect(references[0].priority).toBe('default');
  });

  it('should add reference with user defined priority', async () => {
    db.collection({
      name: 'users',
      fields: [{ type: 'hasOne', name: 'profile', onDelete: 'CASCADE' }],
    });

    db.collection({
      name: 'profiles',
      fields: [{ type: 'belongsTo', name: 'user' }],
    });

    await db.sync();

    const references = db.referenceMap.getReferences('users');

    expect(references.length).toBe(1);
    expect(references[0].priority).toBe('user');
  });
});
