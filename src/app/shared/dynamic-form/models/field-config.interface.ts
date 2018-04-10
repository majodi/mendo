import { Type } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { LookupItem } from '../../custom-components/models/lookup-item.model';
import { ComponentType } from '@angular/core/src/render3';

export interface lookupFld {
  path: string,
  tbl: string,
  fld: string,
  overruleVirtual?: string  //normally fld will be used to set table/brw virtual, here an other field can be used (like an image...)
}

export interface updateWithLookup {
  fld: string,
  lookupFld: string,
  onlyVirgin?: boolean
}

export interface FieldConfig {
  disabled?: boolean,
  hidden?: boolean,
  label?: string,
  name: string,
  options?: string | string[],
  placeholder?: string,
  type: string,
  validation?: ValidatorFn[],
  value?: any,
  doNotPopulate?: boolean,
  readOnly?: boolean,
  initWithCounter?: string,
  buttonClick?: Function,
  inputValueTransform?: Function,
  inputLines?: number,
  inputType?: string,
  customValueChg?: Function,
  customValidator?: Function,
  customLookupItems?: LookupItem[],
  customLookupUniqueId?: Function, //kan toch weg, db dependancy direct in lookup component...
  customLookupFld?: lookupFld,
  customLookupComponent?: Type<any>,
  customLookupItem?: LookupItem,
  customFile?: File,
  customUpdateWithLookup?: updateWithLookup[]
}
