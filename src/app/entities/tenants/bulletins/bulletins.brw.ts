import { Component, OnInit, OnDestroy, Injector, Inject } from '@angular/core'
import { MatDialogRef } from '@angular/material'

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template'
import { Bulletin, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './bulletin.model'
import { BulletinService } from './bulletin.service'
import { ImagesBrwComponent } from '../images/images.brw'

import { BrwBaseClass } from '../../../baseclasses/browse'
import { Embed } from '../../../shared/dynamic-form/models/embed.interface'

@Component({
  selector: 'app-bulletins-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class BulletinsBrwComponent extends BrwBaseClass<Bulletin[]> implements OnInit, OnDestroy {
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value, formAction?) => {
      if (ctrl === 'sticky') {
        const stickyDate: Date = new Date('01/01/2100')
        stickyDate.setHours(6)
        const todayDate: Date = new Date()
        todayDate.setHours(6)
        const dateConfig = this.formConfig[this.formConfig.findIndex(c => c.name === 'date')]
        dateConfig.hidden = value ? value : false
        const currentDate: Date = dateConfig.value ? dateConfig.value : todayDate
        if (typeof currentDate === 'object') {
          dateConfig.value = value ? stickyDate : currentDate.toDateString() === stickyDate.toDateString() ? todayDate : currentDate
        }
      }
    }},
    {type: 'beforeInsertDialog', code: (rec, fld) => {
      rec['date'] = new Date()
      rec['date'].setHours(6)
    }},
    {type: 'beforeChgDialog', code: (rec, fld) => {
      if (!rec['date']) {
        rec['date'] = new Date()
        rec['date'].setHours(6)
      }
    }},
    {type: 'beforeSave', code: (action, o) => {
      o['date'].setHours(6)
      return Promise.resolve()
    }}
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: BulletinService,
  ) {
    super(dialogRef, entityService, injectorService)
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x))
    // this.formConfig = defaultFormConfig
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.setLookupComponent(ImagesBrwComponent, 'image', 'code', 'description')
    super.ngOnInit() // volgorde van belang!
  }

}
