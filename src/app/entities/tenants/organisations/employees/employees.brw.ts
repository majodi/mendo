import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../../shared/custom-components/models/table-template';
import { Employee, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './employee.model'
import { EmployeeService } from './employee.service';
import { OrganisationService } from '../organisation.service';
import { PropertyService } from '../../properties/property.service';

import { BrwBaseClass } from '../../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../../shared/dynamic-form/models/embed.interface';
import { Organisation } from '../organisation.model';
import { Property } from '../../properties/property.model';
import { FieldConfig } from '../../../../shared/dynamic-form/models/field-config.interface';

@Component({
  selector: 'app-employees-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class EmployeesBrwComponent extends BrwBaseClass<Employee[]> implements OnInit, OnDestroy {
  emailOnEntry = ''
  nameOnEntry = ''
  APFormConfig: FieldConfig[]
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value, formAction?) => {
      if(ctrl == 'organisation'){
        const branchChoices = this.formConfig[this.formConfig.findIndex(c => c.name == 'branchChoices')].value
        this.formConfig[this.formConfig.findIndex(c => c.name == 'branch')].options = branchChoices ? branchChoices.split(',') : []
      }
      if(ctrl == 'address.email'){
        if(formAction == undefined && value && value != this.emailOnEntry){
          this.db.syncEmailRecord(value, this.formConfig, 'address.name', 'medewerker')
        } else {
          this.emailOnEntry = value
        }
      }
      if(ctrl == 'address.name'){
        if(formAction == undefined && value && this.emailOnEntry && value != this.nameOnEntry){
          this.db.syncEmailRecord(this.emailOnEntry, this.formConfig, 'address.name', 'medewerker')
        } else {
          this.nameOnEntry = value
        }
      }
    }},
    {type: 'beforeChgDialog', code: (rec, fld) => {
      return this.beforeForm(rec, fld)
    }},
    {type: 'beforeInsertDialog', code: (rec, fld) => {
      return this.beforeForm(rec, fld)
    }},
    {type: 'beforeSave', code: (action, o) => {
      if(this.gs.backButton){
        o['organisation'] = this.gs.NavQueries.find(q => q.fld == 'organisation').value
      }
      console.log('o: ', o)
      return Promise.resolve()
    }},
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: EmployeeService,
    private organisationSrv: OrganisationService,
    private propertySrv: PropertyService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    super.setPulldownItems(this.organisationSrv.initEntity$(), 'organisation', 'address.name', 'address.city')
    super.ngOnInit() //volgorde van belang!
  }

  beforeForm(rec, fld) {
    if(fld == 'propertiesAllowed'){
      this.allowedPropertiesForm(rec)
      return true
    }
    this.emailOnEntry = ''
    this.nameOnEntry = ''
    const organisationConfig = this.formConfig.find(fc => fc.name == 'organisation')
    const branchConfig = this.formConfig.find(fc => fc.name == 'branch')
    if(this.gs.backButton && organisationConfig != undefined){
      organisationConfig.doNotPopulate = true
      const organisation = this.gs.NavQueries.find(q => q.fld == 'organisation').value
      if(organisation != undefined && branchConfig != undefined){
        this.db.getDoc(`${this.gs.entityBasePath}/organisations/${organisation}`).then((o: Organisation) => {
          branchConfig.options = o.branches ? o.branches.split(',') : []
        })
      }
    }
    return false
  }

  allowedPropertiesForm(rec: Employee) {
    this.propertySrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe(properties => {
      let formValues = {propertiesAllowed: rec.propertiesAllowed}
      this.APFormConfig = [{type: 'stringdisplay', label: 'Keuzes', name: 'header', placeholder: 'Keuzes', value: 'Definieer per categorie (waar wenselijk) een subselectie van toegestane keuzes'}]
      properties.forEach((property: Property) => {
        this.APFormConfig.push({type: 'checkbox', label: 'Subselectie voor: '+property.code, name: 'propertiesAllowed.'+property.id, placeholder: 'Subselectie voor: '+property.code, value: rec.propertiesAllowed[property.id]})
        this.APFormConfig.push({type: 'chiplist', label: 'Toegestaan', name: 'propertiesAllowed.'+property.id, placeholder: 'Toegestaan', value: rec.propertiesAllowed[property.id] ? rec.propertiesAllowed[property.id].split(',').reduce((result, item) => {result[item] = true; return result}, {}) : {}, options: property.choices.split(',').map(i => i.trim()), hidden: !rec.propertiesAllowed[property.id]})
      })
      this.ps.formDialog(2, this.APFormConfig, formValues, (ctrl, value) => {this.formValChg(ctrl, value)}).then(res => {
        if(res && res['response'] == 'save'){
          let newAllowed = {}
          Object.keys(res.value).forEach(p => {
            if(p != 'header'){
              const keys = Object.keys(res.value[p])
              if(keys.length > 0){
                newAllowed[p.split('.')[1]] = keys.join(',')
              }
            }
          })
          this.db.updateDoc({propertiesAllowed: newAllowed}, `${this.gs.entityBasePath}/employees/${rec.id}`)
        }
      })
    })
  }

  formValChg(ctrl: string, value) {
    const chiplistConfig = this.APFormConfig.find(c => c.type == 'chiplist' && c.name == ctrl)
    if(typeof value == 'boolean'){
      chiplistConfig.hidden = !chiplistConfig.hidden
    }
  }

}
