import { Component, OnInit, OnDestroy, Injector } from '@angular/core'
import { Router } from '@angular/router'

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template'
import { Form, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './form.model'
import { FormService } from './form.service'
import { FormFieldService } from './formfields/formfield.service'

import { BrwBaseClass } from '../../../baseclasses/browse'
import { MatDialogRef } from '@angular/material'
import { Embed } from '../../../shared/dynamic-form/models/embed.interface'
import { takeUntil, take } from 'rxjs/operators'
import { FormField } from './formfields/formfield.model'

@Component({
  selector: 'app-forms-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class FormsBrwComponent extends BrwBaseClass<Form[]> implements OnInit, OnDestroy {
  embeds: Embed[] = [
    {type: 'beforeChgDialog', code: (rec, fld) => {
      if (fld === 'edit' && !this.selectMode) {
        this.gs.navigateWithQuery('/app-tenant/formfields', 'form', '==', rec['id'])
        return true
      }
      if (fld === 'copy' && !this.selectMode) {
        this.ps.buttonDialog('Maak kopie van formulier:\r\n\n' + rec['code'], 'OK', 'Annuleer').then(b => {
          if (b === 1) {
            this.db.addDoc({code: rec['code'] + '[kopie]', description: rec['description'], postMessage: rec['postMessage']}, `${this.gs.entityBasePath}/forms`).then(docRef => {
              this.formFieldSrv.initEntity$([{fld: 'form', operator: '==', value: rec['id']}]).pipe(takeUntil(this.ngUnsubscribe), )
              .subscribe(flds => {
                flds.forEach((field) => {
                  const copyField = Object.assign({}, field)
                  copyField['form'] = docRef.id
                  delete copyField['id']
                  // console.log('copyField: ', copyField)
                  this.db.addDoc(copyField, `${this.gs.entityBasePath}/formfields`)
                })
              })
            })
          }
        })
        return true
      }
      if (fld === 'results' && !this.selectMode) {
        this.gs.navigateWithQuery('/app-tenant/formresults', 'form', '==', rec['id'])
        return true
      }
      return false
    }},
    {type: 'beforeDelete', code: (action, rec) => {
      // console.log('recid rec: ', rec['id'], rec)
      return this.formFieldSrv.initEntity$([{fld: 'form', operator: '==', value: rec['id']}]).pipe(take(1), )
      .toPromise()
      .then(flds => {
        flds.forEach((field) => {
          // console.log('delete: ', field['id'])
          this.db.deleteDoc(`${this.gs.entityBasePath}/formfields/${field['id']}`)
        })
        return true
      })
    }},
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: FormService,
    private formFieldSrv: FormFieldService,
    private router: Router,
  ) {
    super(dialogRef, entityService, injectorService)
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x))
    // this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.ngOnInit() // volgorde van belang!
  }

}
