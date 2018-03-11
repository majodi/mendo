import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldConfig } from './shared/dynamic-form/models/field-config.interface';
import { PopupService } from './services/popup.service';

@Component({
  selector: 'app-home',
  styles: [``],
  template: `
  <div style="width:100%">
    <button mat-button (click)="click()">Button</button>
  </div>
  `,
})
export class HomePageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<string>()

  constructor(private ps: PopupService) {}

  ngOnInit() {
    //    formDialog(action: number, fieldConfig: FieldConfig[], formRecord: {}, onValueChg?: Function) {
  }

  click() {
    let fieldConfig = [
      {name: 'naam', type:  'input', label: 'Naam', placeholder: 'Naam'},
      {name: 'email', type: 'input', label: 'Email', placeholder: 'Email adres'},
    ]
    this.ps.formDialog(10, fieldConfig, {}).then(v => console.log('v: ', v))
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()    
  }

}

// export interface FieldConfig {
//   disabled?: boolean,
//   label?: string,
//   name: string,
//   options?: string | string[],
//   placeholder?: string,
//   type: string,
//   validation?: ValidatorFn[],
//   value?: any,
//   doNotPopulate?: boolean,
//   initWithCounter?: string,
//   buttonClick?: Function,
//   inputValueTransform?: Function,
//   inputLines?: number,
//   customValueChg?: Function,
//   customValidator?: Function,
//   customLookupItems?: LookupItem[],
//   customLookupUniqueId?: Function, //kan toch weg, db dependancy direct in lookup component...
//   customLookupFld?: lookupFld
//   customLookupComponent?: Type<any>
//   customLookupItem?: LookupItem
//   customFile?: File
//   customUpdateWithLookup?: updateWithLookup
// }
