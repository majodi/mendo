import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { LookupItem } from '../../custom-components/models/lookup-item.model';

export interface FieldConfig {
  disabled?: boolean,
  label?: string,
  name: string,
  options?: string | string[],
  placeholder?: string,
  type: string,
  validation?: ValidatorFn[],
  value?: any,
  buttonClick?: Function,
  customValueChg?: Function,
  customValidator?: Function,
  customLookupItems?: LookupItem[],
  customLookupId?: string
}
