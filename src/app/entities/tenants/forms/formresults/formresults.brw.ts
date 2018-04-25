import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { FormResult, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './formresult.model'
import { FormResultService } from './formresult.service';
import { FormFieldService } from '../formfields/formfield.service';

import { BrwBaseClass } from '../../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../../shared/dynamic-form/models/embed.interface';
import { forceCapitalize, forceUppercase } from '../../../../shared/dynamic-form/models/form-functions';
import { ImagesBrwComponent } from '../../images/images.brw';

@Component({
  selector: 'app-formresults-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class FormResultsBrwComponent extends BrwBaseClass<FormResult[]> implements OnInit, OnDestroy {
  embeds: Embed[] = [
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
    private entityService: FormResultService,
    private formFieldSrv: FormFieldService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.userDefinedBrowse = true
    this.alternativeFormActionTitle = 'Invulformulier'
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.colDef = []
    this.formConfig = []
    this.formFieldSrv.initEntity$(this.gs.NavQueries).takeUntil(this.ngUnsubscribe)
    .map(flds => flds.sort(function(a,b) {return (a['order'] > b['order']) ? 1 : ((b['order'] > a['order']) ? -1 : 0);}))
    .subscribe(flds => {
      flds.forEach(fld => {
        const fieldType = ['input', 'select', 'checkbox', 'stringdisplay', 'imagedisplay'][['invoer', 'keuze', 'vink', 'tekst', 'afbeelding'].findIndex(t => t == fld['type'])]
        if(fld['showInBrw']){
          this.colDef.push({name: fld['name'], header: fld['label'], hideXs: fld['hideXs'], sort: fld['allowSort'], filter: fld['allowFilter']})
        }
        let validation = []
        if(fld['required']){validation.push(Validators.required)}
        if(!isNaN(fld['minLength'])){validation.push(Validators.minLength(+fld['minLength']))}
        let transform = [undefined, forceUppercase, forceCapitalize][['geen', 'hoofdletters', 'woord-hoofdletter'].findIndex(t => t == fld['transform'])]
        if(fieldType == 'imagedisplay'){

          this.db.getUniqueValueId(`${this.gs.entityBasePath}/images`, 'id', fld['image']).subscribe(rec => {
            if(rec){
              //async dus op dat moment naar juiste index zoeken:
              this.formConfig[this.formConfig.findIndex(c => c.name == fld['name'])].value = rec.name
            }
          })          
        }
        const optionsStr: string = fld['options']; const options = optionsStr ? optionsStr.split(',') : []
        this.formConfig.push({type: fieldType, label: fld['label'], name: fld['name'], placeholder: fld['label'], value: fld['value'], imageStyle: {'width': '100%'}, options: options, validation: validation, inputValueTransform: transform})        
      })
      super.ngOnInit() //volgorde van belang!
    })
    
    // super.ngOnInit() //volgorde van belang!
  }

}

// this.formFieldSrv.initEntity$(this.gs.NavQueries).takeUntil(this.ngUnsubscribe)
// .map(flds => flds.sort(function(a,b) {return (a['order'] > b['order']) ? 1 : ((b['order'] > a['order']) ? -1 : 0);}))
// .subscribe(flds => flds.forEach(fld => {
//   const fieldType = ['input', 'select', 'checkbox', 'stringdisplay', 'imagedisplay'][['invoer', 'keuze', 'vink', 'tekst', 'afbeelding'].findIndex(t => t == fld['type'])]
//   if(fld['showInBrw']){
//     this.colDef.push({name: fld['name'], header: fld['label'], hideXs: fld['hideXs'], sort: fld['allowSort'], filter: fld['allowFilter']})
//   }
//   let validation = []
//   if(fld['required']){validation.push(Validators.required)}
//   if(!isNaN(fld['minLength'])){validation.push(Validators.minLength(+fld['minLength']))}
//   let transform = [undefined, forceUppercase, forceCapitalize][['geen', 'hoofdletters', 'woord-hoofdletter'].findIndex(t => t == fld['transform'])]
//   if(fieldType == 'imagedisplay'){
//     this.db.getUniqueValueId(`${this.gs.entityBasePath}/images`, 'id', fld['image']).subscribe(rec => {
//       if(rec){
//         //async dus op dat moment naar juiste index zoeken:
//         this.formConfig[this.formConfig.findIndex(c => c.name == fld['name'])].value = rec.name
//       }
//     })          
//   }
//   const optionsStr: string = fld['options']; const options = optionsStr ? optionsStr.split(',') : []
//   this.formConfig.push({type: fieldType, label: fld['label'], name: fld['name'], placeholder: fld['label'], value: fld['value'], options: options, validation: validation, inputValueTransform: transform})
// }))
