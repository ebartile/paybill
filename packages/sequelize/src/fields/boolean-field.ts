import { DataTypes } from 'sequelize';
import { type BaseColumnFieldOptions, Field } from './field';

export class BooleanField extends Field {
  get dataType() {
    return DataTypes.BOOLEAN;
  }
}

export interface BooleanFieldOptions extends BaseColumnFieldOptions {
  type: 'boolean';
}
