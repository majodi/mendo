import { Component, OnInit, OnDestroy, Injector, Inject } from '@angular/core'
import { MatDialogRef } from '@angular/material'

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template'
import { Document, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './document.model'
import { DocumentService } from './document.service'

import { BrwBaseClass } from '../../../baseclasses/browse'
import { Embed } from '../../../shared/dynamic-form/models/embed.interface'

@Component({
  selector: 'app-documents-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class DocumentsBrwComponent extends BrwBaseClass<Document[]> implements OnInit, OnDestroy {
  // embeds: Embed[] = [
  //   {type: 'beforeSave', code: (action, image) => {
  //     if(action == 1){
  //       image['thumbName'] = image['name']
  //     }
  //     return Promise.resolve()
  //   }}
  // ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: DocumentService,
  ) {
    super(dialogRef, entityService, injectorService)
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x))
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    this.formConfig.find(c => c.name === 'download').buttonClick = (e) => {
      const url = this.formConfig.find(c => c.name === 'download').value['name']
      const popupWin = window.open(url, '_blank', 'top=0,left=0,height=100%,width=auto')
    }
    super.ngOnInit() // volgorde van belang!
  }

}
