import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { FormField, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './formfield.model'
import { FormFieldService } from './formfield.service';

import { BrwBaseClass } from '../../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../../shared/dynamic-form/models/embed.interface';
import { ImagesBrwComponent } from '../../images/images.brw';
import { forceUppercase, forceCapitalize } from '../../../../shared/dynamic-form/models/form-functions';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-formfields-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class FormFieldsBrwComponent extends BrwBaseClass<FormField[]> implements OnInit, OnDestroy {

  // HIDE
  // 'invoer'                                                      'options',  'value',  'image', 'imagedisplay'
  // 'keuze'                 'transform', 'required', 'minLength',             'value',  'image', 'imagedisplay'
  // 'vink'                  'transform', 'required', 'minLength', 'options',  'value',  'image', 'imagedisplay'
  // 'tekst'       'label',  'transform', 'required', 'minLength', 'options',  'value',  'image', 'imagedisplay'
  // 'afbeelding'  'label',  'transform', 'required', 'minLength', 'options',  'value'

  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value, formAction?) => {
      // console.log('embed onvaluechg, ctrl: ', ctrl, formAction)
      if(ctrl == 'type'){
        this.formConfig.forEach(c => {
          c.doNotPopulate = true

          if(c.name == 'value' || c.name == 'order'){c.doNotPopulate = false}
          if((c.name == 'name' || c.name =='type') && (formAction == undefined || formAction != 2)){c.doNotPopulate = false}

          if(['tabelinstelling', 'showInBrw', 'hideXs', 'allowSort', 'allowfilter'].includes(c.name) && ['invoer', 'keuze', 'vink'].includes(value)){c.doNotPopulate = false}
          if(c.name == 'label'        && ['invoer', 'keuze', 'vink', 'tekst'].includes(value)){c.doNotPopulate = false}
          if(c.name == 'transform'    && value == 'invoer'){c.doNotPopulate = false}
          if(c.name == 'required'     && value == 'invoer'){c.doNotPopulate = false}
          if(c.name == 'minLength'    && value == 'invoer'){c.doNotPopulate = false}
          if(c.name == 'options'      && value == 'keuze'){c.doNotPopulate = false}
          if(c.name == 'image'        && value == 'afbeelding'){c.doNotPopulate = false}
          if(c.name == 'imagedisplay' && value == 'afbeelding'){c.doNotPopulate = false}

          if(c.name == 'hideXs') console.log('hideXs: ', c.doNotPopulate)
          if(c.name == 'tabelinstelling') console.log('tabelinstelling: ', c.doNotPopulate)
        })
      }
    }},
    {type: 'beforeSave', code: (action, o) => {
      if(action == 1){
        o['form'] = this.gs.NavQueries.find(q => q.fld == 'form').value
        return Promise.resolve()
      } else return Promise.resolve()  
    }}    
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: FormFieldService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.resetDoNotPopulate = true
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.setLookupComponent(ImagesBrwComponent, 'image', 'code', 'description')
    super.ngOnInit() //volgorde van belang!
  }

}
