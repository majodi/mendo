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
  ]

  constructor(
    public dialogRef: MatDialogRef<any>,
    private injectorService: Injector,
    private entityService: ArticleService,
    private categorySrv: CategoryService,
    private propertySrv: PropertyService,
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
    super.setLookupComponent(ImagesBrwComponent, 'image', 'code', 'description')
    super.setPulldownItems(this.categorySrv.initEntity$(), 'category', 'code', 'description')
    super.setPulldownItems(this.propertySrv.initEntity$(), 'measurements', 'code', 'choices')
    super.setPulldownItems(this.propertySrv.initEntity$(), 'colors', 'code', 'choices')
    super.ngOnInit() //volgorde van belang!
  }

}
