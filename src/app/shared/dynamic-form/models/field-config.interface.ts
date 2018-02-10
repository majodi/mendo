import { ValidatorFn } from '@angular/forms';

export interface FieldConfig {
  disabled?: boolean,
  label?: string,
  name: string,
  options?: string | string[],
  placeholder?: string,
  type: string,
  validation?: ValidatorFn[],
  value?: any,
  customValueChg?: Function,
  customValidator?: Function
}
