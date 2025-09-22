import { DatabaseOptions } from '../database';
import { BaseDialect } from './base-dialect';

export class MariadbDialect extends BaseDialect {
  static dialectName = 'mariadb';

  getSequelizeOptions(options: DatabaseOptions) {
    options.dialectOptions = { ...(options.dialectOptions || {}), supportBigNumbers: true, bigNumberStrings: true };
    return options;
  }

  getVersionGuard() {
    return {
      sql: 'select version() as version',
      get: (v: string) => {
        const m = /([\d+.]+)/.exec(v);
        return m[0];
      },
      version: '>=10.9',
    };
  }
}
