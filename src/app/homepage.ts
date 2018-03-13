import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldConfig } from './shared/dynamic-form/models/field-config.interface';
import { PopupService } from './services/popup.service';

@Component({
  selector: 'app-home',
  styles: [``],
  template: `
  <div style="width:100%">
    <br><br><br><br><br>
    <h1 style="text-align:center">Homepage</h1>    
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
