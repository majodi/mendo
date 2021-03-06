import { Type } from '@angular/core'
import { ValidatorFn } from '@angular/forms'
import { LookupItem } from '../../custom-components/models/lookup-item.model'
import { ComponentType } from '@angular/core/src/render3'
import { Observable } from 'rxjs'

// tslint:disable-next-line:class-name
export interface lookupFld {
  path: string,
  tbl: string,
  fld: string,
  overruleVirtual?: string  // normally fld will be used to set table/brw virtual, here an other field can be used (like an image...)
}

// overruleFunction?: Function //if available this function will be used to determine value. Input parameters are (record, field) where field is either fld or overruleVirtual

// tslint:disable-next-line:class-name
export interface updateWithLookup {
  fld: string,
  lookupFld?: string,
  onlyVirgin?: boolean,
  lookupFunction?: Function
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
  suggestions?: (string) => Observable<any[]>,
  emailNameField?: string,
  inputLines?: number,
  inputType?: string,
  customValueChg?: Function,
  customValidator?: Function,
  customLookupItems?: LookupItem[],
  customLookupUniqueId?: Function, // kan toch weg, db dependancy direct in lookup component...
  customLookupFld?: lookupFld,
  customLookupComponent?: Type<any>,
  customLookupItem?: LookupItem,
  customFile?: File,
  customUpdateWithLookup?: updateWithLookup[],
  customSelectChildrenComponent?: Type<any>,
  customSelectChildrenCurrentParent?: string,
  imageStyle?: any,
  requiredModules?: string[],
  valueChgEmbedOnBlur?: boolean,  // run onValueChg embed on blur input field and assign config value to screen var
  defaultFocus?: boolean // should get field focus on form entry (only first field with true will get the focus)
}
