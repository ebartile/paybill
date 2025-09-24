import lodash from 'lodash';
import { BaseDialect } from './base-dialect';

export class MysqlDialect extends BaseDialect {
  static dialectName = 'mysql';

  getVersionGuard() {
    return {
      sql: 'select version() as version',
      get: (v: string) => {
        const m = /([\d+.]+)/.exec(v);
        return m[0];
      },
      version: '>=8.0.17',
    };
  }

  getSequelizeOptions(options: any) {
    lodash.set(options, 'dialectOptions.multipleStatements', true);
    return options;
  }
}
