import { Component, OnInit, OnDestroy, Injector } from '@angular/core';

import { defaultTableTemplate } from '../../../shared/custom-components/models/table-template';
import { Article, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultSelectionFields } from './article.model'
import { ArticleService } from './article.service';
import { CategoryService } from '../categories/category.service';
import { PropertyService } from '../properties/property.service';
import { ImagesBrwComponent } from '../images/images.brw';

import { BrwBaseClass } from '../../../baseclasses/browse';
import { MatDialogRef } from '@angular/material';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';
import { OrganisationService } from '../organisations/organisation.service';

@Component({
  selector: 'app-articles-brw',
  template: defaultTableTemplate,
  styles: [``]
})
export class ArticlesBrwComponent extends BrwBaseClass<Article[]> implements OnInit, OnDestroy {
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value) => {
      if(ctrl == 'overruleMeasurements'){
        const overruleMeasurements = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleMeasurements')].value
        this.formConfig[this.formConfig.findIndex(c => c.name == 'measurementsOverrule')].hidden = overruleMeasurements ? !overruleMeasurements : true
      }
      if(ctrl == 'measurements'){
        const measurementsChoices = this.formConfig[this.formConfig.findIndex(c => c.name == 'measurementsChoices')].value
        if(measurementsChoices){
          let measurementsChoicesArray: Array<string> = measurementsChoices.split(',')
          this.formConfig[this.formConfig.findIndex(c => c.name == 'measurementsOverrule')].options = measurementsChoicesArray
          const measurementsOverruleValue = this.formConfig[this.formConfig.findIndex(c => c.name == 'measurementsOverrule')].value
          for (var key in measurementsOverruleValue){
            if(!measurementsChoicesArray.includes(key)){delete measurementsOverruleValue[key]}
          }
          this.formConfig[this.formConfig.findIndex(c => c.name == 'measurementsOverrule')].value = measurementsOverruleValue
        }
      }
      if(ctrl == 'overruleColors'){
        const overruleColors = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleColors')].value
        this.formConfig[this.formConfig.findIndex(c => c.name == 'colorsOverrule')].hidden = overruleColors ? !overruleColors : true
      }
      if(ctrl == 'colors'){
        const colorsChoices = this.formConfig[this.formConfig.findIndex(c => c.name == 'colorsChoices')].value
        if(colorsChoices){
          let colorsChoicesArray: Array<string> = colorsChoices.split(',')
          this.formConfig[this.formConfig.findIndex(c => c.name == 'colorsOverrule')].options = colorsChoicesArray
          const colorsOverruleValue = this.formConfig[this.formConfig.findIndex(c => c.name == 'colorsOverrule')].value
          for (var key in colorsOverruleValue){
            if(!colorsChoicesArray.includes(key)){delete colorsOverruleValue[key]}
          }
          this.formConfig[this.formConfig.findIndex(c => c.name == 'colorsOverrule')].value = colorsOverruleValue
        }
      }
    }},
    {type: 'beforeChgDialog', code: (rec, fld) => {
      if(fld == 'price' && !this.selectMode){
        const priceColDef = this.colDef.find(cd => cd.name == 'price')
        if(priceColDef != undefined && priceColDef.headerSelectValue){
          const headerSelectObj = priceColDef.headerSelect.find(hs => hs.value == priceColDef.headerSelectValue)
          const headerSelectViewValue = headerSelectObj ? headerSelectObj.viewValue : 'not found'
          const overrulePriceMessage = (rec['priceOverrule'] != undefined && rec['priceOverrule'][priceColDef.headerSelectValue]) ? rec['priceOverrule'][priceColDef.headerSelectValue] : 'Standaard Prijs'
          const overrulePriceValue = (rec['priceOverrule'] != undefined && rec['priceOverrule'][priceColDef.headerSelectValue]) ? rec['priceOverrule'][priceColDef.headerSelectValue] : ''
          const dialogText = `Standaard Artikelprijs:\r\n\r\n${rec['price']}\r\n\r\n${headerSelectViewValue}:\r\n\r\n${overrulePriceMessage}`
          const field = {value: overrulePriceValue, placeholder: 'Hanteer Standaard Prijs', label: 'Nieuwe prijs'}
          return this.ps.buttonDialog(dialogText, 'Bewaar', 'Annuleer', field).then(b => {
            if(b == 1){
              let priceOverruleFld: any = rec['priceOverrule'] != undefined ? rec['priceOverrule'] : {}
              if(field.value){
                priceOverruleFld[priceColDef.headerSelectValue] = field.value
                this.db.setDoc({priceOverrule: priceOverruleFld}, `${this.entityService.entityPath}/${rec['id']}`, {merge: true})
              }
            }
            return true
          })
        } else {
          return false
        }
      }
    }},
    {type: 'beforeInsertDialog', code: (o) => {
      o['overruleMeasurements'] = true
      o['overruleColors'] = true
      return false
    }},
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: ArticleService,
    private categorySrv: CategoryService,
    private propertySrv: PropertyService,
    private organisationSrv: OrganisationService,
  ) {
    super(dialogRef, entityService, injectorService);
  }

  ngOnInit() {
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    // this.formConfig = defaultFormConfig
    this.formConfig[this.formConfig.findIndex(c => c.name == 'measurementsOverrule')].hidden = true //quick fix
    this.formConfig[this.formConfig.findIndex(c => c.name == 'colorsOverrule')].hidden = true
    this.title = defaultTitle
    this.titleIcon = defaultTitleIcon
    this.selectionFields = defaultSelectionFields
    this.organisationSrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe(organisations => {
      const priceCol = this.colDef.find(cd => cd.name == 'price')
      if(priceCol != undefined){
        let hsArray = []
        organisations.forEach(organisation => {
          hsArray.push({value: organisation['id'], viewValue: 'Prijs - '+organisation['address']['name']})
        })
        priceCol.headerSelect = hsArray
      }
    })
    super.setLookupComponent(ImagesBrwComponent, 'image', 'code', 'description')
    super.setPulldownItems(this.categorySrv.initEntity$(), 'category', 'code', 'description')
    super.setPulldownItems(this.propertySrv.initEntity$(), 'measurements', 'code', 'choices')
    super.setPulldownItems(this.propertySrv.initEntity$(), 'colors', 'code', 'choices')
    super.ngOnInit() //volgorde van belang!
  }
  
}
