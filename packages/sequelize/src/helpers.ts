import { Database } from './database';
import { MysqlDialect } from './dialects/mysql-dialect';
import { SqliteDialect } from './dialects/sqlite-dialect';
import { MariadbDialect } from './dialects/mariadb-dialect';
import { PostgresDialect } from './dialects/postgres-dialect';

export async function checkDatabaseVersion(db: Database) {
  await db.dialect.checkDatabaseVersion(db);
}

export function registerDialects() {
  [SqliteDialect, MysqlDialect, MariadbDialect, PostgresDialect].forEach((dialect) => {
    Database.registerDialect(dialect);
  });
}
