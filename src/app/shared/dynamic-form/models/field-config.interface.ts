import { ValidatorFn } from '@angular/forms';
import { LookupItem } from '../../custom-components/models/lookup-item.model';

interface lookupFld {
  path: string,
  tbl: string,
  fld: string
}

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
  inputValueTransform?: Function,
  customValueChg?: Function,
  customValidator?: Function,
  customLookupItems?: LookupItem[],
  customLookupId?: string, //kanweg
  customLookupFld?: lookupFld
}
