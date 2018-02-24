import { Type } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { LookupItem } from '../../custom-components/models/lookup-item.model';
import { ComponentType } from '@angular/core/src/render3';

export interface lookupFld {
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
  customLookupUniqueId?: Function, //kan toch weg, db dependancy direct in lookup component...
  customLookupFld?: lookupFld
  customLookupComponent?: Type<any>
  customLookupItem?: LookupItem
}
