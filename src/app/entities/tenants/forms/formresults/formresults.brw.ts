
import {map, takeUntil} from 'rxjs/operators'
import { Component, OnInit, OnDestroy, Injector } from '@angular/core'
import { Validators } from '@angular/forms'

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template'
import { FormResult, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig } from './formresult.model'
import { FormResultService } from './formresult.service'
import { FormFieldService } from '../formfields/formfield.service'

import { BrwBaseClass } from '../../../../baseclasses/browse'
import { MatDialogRef } from '@angular/material'
import { Embed } from '../../../../shared/dynamic-form/models/embed.interface'
import { forceCapitalize, forceUppercase } from '../../../../shared/dynamic-form/models/form-functions'
import { ImagesBrwComponent } from '../../images/images.brw'

@Component({
  selector: 'app-formresults-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class FormResultsBrwComponent extends BrwBaseClass<FormResult[]> implements OnInit, OnDestroy {
  emailOnEntry = '!'
  nameOnEntry = '!'
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value, formAction?) => {
      if (this.gs.activeUser.level > 0) {
        const form = this.gs.NavQueries.find(nq => nq.fld === 'form' && nq.value !== undefined)
        const emailSyncFieldConfig = this.formConfig.find(c => c.emailNameField !== undefined && c.emailNameField !== '')
        if (emailSyncFieldConfig !== undefined) {
          if (ctrl === emailSyncFieldConfig.name) {
            if (formAction === undefined && value && value !== this.emailOnEntry) {
              this.db.syncEmailRecord(value, this.formConfig, emailSyncFieldConfig.emailNameField, form !== undefined ? form.value : '')
            }
            this.emailOnEntry = value
          }
          if (ctrl === emailSyncFieldConfig.emailNameField) {
            if (formAction === undefined && value && this.emailOnEntry && value !== this.nameOnEntry) {
              this.db.syncEmailRecord(this.emailOnEntry, this.formConfig, emailSyncFieldConfig.emailNameField, form !== undefined ? form.value : '')
            }
            this.nameOnEntry = value
          }
        }
      }
    }},
    {type: 'beforeSave', code: (action, o) => {
      if (action === 1) {
        o['form'] = this.gs.NavQueries.find(q => q.fld === 'form').value
        return Promise.resolve()
      } else { return Promise.resolve() }
    }}
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: FormResultService,
    private formFieldSrv: FormFieldService,
  ) {
    super(dialogRef, entityService, injectorService)
  }

  ngOnInit() {
    this.userDefinedBrowse = true
    this.alternativeFormActionTitle = 'Invulformulier'
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.colDef = []
    this.formConfig = []
    this.formFieldSrv.initEntity$(this.gs.NavQueries).pipe(takeUntil(this.ngUnsubscribe),
    map(flds => flds.sort(function(a, b) {return (a['order'] > b['order']) ? 1 : ((b['order'] > a['order']) ? -1 : 0)})), )
    .subscribe(flds => {
      flds.forEach(fld => {
        const fieldType = ['input', 'select', 'checkbox', 'stringdisplay', 'imagedisplay'][['invoer', 'keuze', 'vink', 'tekst', 'afbeelding'].findIndex(t => t === fld['type'])]
        if (fld['showInBrw']) {
          this.colDef.push({name: fld['name'], header: fld['label'], hideXs: fld['hideXs'], sort: fld['allowSort'], filter: fld['allowFilter']})
        }
        const validation = []
        if (fld['required']) {validation.push(Validators.required)}
        if (!isNaN(fld['minLength'])) {validation.push(Validators.minLength(+fld['minLength']))}
        const transform = [undefined, forceUppercase, forceCapitalize][['geen', 'hoofdletters', 'woord-hoofdletter'].findIndex(t => t === fld['transform'])]
        if (fieldType === 'imagedisplay') {

          this.db.getUniqueValueId(`${this.gs.entityBasePath}/images`, 'id', fld['image']).subscribe(rec => {
            if (rec) {
              // async dus op dat moment naar juiste index zoeken:
              this.formConfigInitial[this.formConfig.findIndex(c => c.name === fld['name'])].value = rec.name
            }
          })
        }
        const optionsStr: string = fld['options']; const options = optionsStr ? optionsStr.split(',') : []
        // if fld is email and user is more then regular web user then also provide suggestions function that will return
        // an observable with an array of suggestions to be used (when called).
        // an input field will use this feature if provided
        // if emailNameField is given by the fields editor input then the fieldname and a value is passed on
        // to the suggestions provider (input field that calls this function), there the emailNameField will
        // be filled (using the form reference the input field has).
        this.formConfig.push({
          type: fieldType, label: fld['label'], name: fld['name'], placeholder: fld['label'], value: fld['value'], imageStyle: {'width': '100%'}, options: options, validation: validation, inputValueTransform: transform,
          suggestions: fld['isEmail'] !== undefined && fld['isEmail'] && this.gs.activeUser.level > 0 ? (inp) => {
            const suggestions = this.db.getOnKeyOrder(`${this.gs.entityBasePath}/emailaddresses`, inp, 3)
            .pipe(
              map(sugs => sugs.map(sug => {
                const retval = {}
                retval['suggestion'] = sug.id
                retval['toUpdateField'] = fld['emailNameField'] !== undefined && fld['emailNameField'] !== '' ? fld['emailNameField'] : ''
                retval['toUpdateValue'] = `${sug['firstName']}${sug['prefix'] !== undefined && sug['prefix'] !== '' ? ' ' + sug['prefix'] + ' ' : ' '}${sug['lastName']}`
                return retval
              }))
            )
            return suggestions
          } : undefined,
          emailNameField: fld['isEmail'] !== undefined && fld['isEmail'] && fld['emailNameField'] !== undefined && fld['emailNameField'] && this.gs.activeUser.level > 0 ? fld['emailNameField'] : undefined,
        })
      })
      super.ngOnInit() // volgorde van belang!
    })
  }

}
