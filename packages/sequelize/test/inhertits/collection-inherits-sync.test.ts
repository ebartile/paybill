import { mockDatabase, Database } from '../../src';

describe('sync inherits', () => {
  let db: Database;

  beforeEach(async () => {
    db = await mockDatabase();
    await db.clean({ drop: true });
  });

  afterEach(async () => {
    await db.close();
  });

  it('should update table fields', async () => {
    if(!db.inDialect('postgres')) return;
    db.collection({
      name: 'person',
      fields: [{ type: 'string', name: 'name' }],
    });

    const student = db.collection({
      name: 'student',
      inherits: 'person',
    });

    await db.sync();

    student.setField('score', { type: 'integer' });

    await db.sync();

    const studentTableInfo = await db.sequelize.getQueryInterface().describeTable(student.model.tableName);
    expect(studentTableInfo.score).toBeDefined();
  });
});
