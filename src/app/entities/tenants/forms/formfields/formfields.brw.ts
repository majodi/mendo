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
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value) => {
      // console.log('onvalchg: ', ctrl, value)
      if(ctrl == 'type'){
        const hideGroup = ['transform', 'required', 'minLength', 'image', 'imagedisplay', 'options']
        this.formConfig.forEach(c => {
          c.doNotPopulate = false
          if(value == 'invoer' && (c.name == 'options' || c.name == 'image' || c.name == 'imagedisplay')){
            c.doNotPopulate = true
          }
          if(value == 'keuze' && hideGroup.includes(c.name)){
            c.doNotPopulate = c.name == 'options' ? false : true
          }
          if(value == 'afbeelding' && hideGroup.includes(c.name)){
            c.doNotPopulate = (c.name == 'image' || c.name == 'imagedisplay') ? false : true
          }
          if((value == 'vink' || value == 'text') && hideGroup.includes(c.name)){
            c.doNotPopulate = true
          }
          if(value == 'text' && c.name == 'label'){
            c.doNotPopulate = true
          }          
        })
      }
    }},
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
    // this.embeds[0].code('type', )
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    super.setLookupComponent(ImagesBrwComponent, 'image', 'code', 'description')
    super.ngOnInit() //volgorde van belang!
  }

}