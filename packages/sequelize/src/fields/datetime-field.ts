import { DateField } from './date-field';
import { type BaseColumnFieldOptions } from './field';

export class DatetimeField extends DateField {}

export interface DatetimeFieldOptions extends BaseColumnFieldOptions {
  type: 'datetime';
}
