import { Input, Output, EventEmitter, Type, Inject, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

// import { LookupItem } from '../../../shared/custom-components/models/lookup-item.model';
import { ColumnDefenition } from '../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface';
import { SelectionField } from '../shared/dynamic-form/models/selection-field.interface';
import { QueryItem } from '../models/query-item.interface';
import { DbService } from '../services/db.service';
import { PopupService } from '../services/popup.service';
import { GlobService } from '../services/glob.service';
import { UploadService } from '../services/upload.service';
import { CrudService } from '../services/crud.service';

import { EntityService } from '../models/entity-service.interface';

export class BrwBaseClass<T> {
  @Input() select: boolean
  @Input() sober: boolean
  @Output() selected = new EventEmitter()
  data: T
  ngUnsubscribe = new Subject<string>()
  dataLoaded = new Subject()
  userDefinedBrowse = false
  title = ''
  titleIcon = ''
  isLoading = true
  selectMode = false
  soberMode = false
  selectionButton = false
  selectionActive = false
  insertButton = true
  colDef: ColumnDefenition[]
  formConfig: FieldConfig[]
  formConfigInitial: FieldConfig[]
  alternativeFormActionTitle: string
  resetDoNotPopulate = false
  selectionFields: SelectionField[] = []
  selectionFieldConfig: FieldConfig[] = []
  baseQueries: QueryItem[]
  db: DbService
  ps: PopupService
  gs: GlobService
  us: UploadService
  cs: CrudService
  ar: ActivatedRoute

  constructor(
    public dialogRef: MatDialogRef<any>,
    private entitySrv: EntityService,
    private injectorSrv: Injector,
  ) {
    this.db = injectorSrv.get(DbService)
    this.ps = injectorSrv.get(PopupService)
    this.gs = injectorSrv.get(GlobService)
    this.us = injectorSrv.get(UploadService)
    this.cs = injectorSrv.get(CrudService)
    this.ar = injectorSrv.get(ActivatedRoute)
  }

  ngOnInit() {
    this.formConfigInitial = this.formConfig.map(x => Object.assign({}, x));
    this.selectMode = this.select
    this.soberMode = this.sober
    this.entitySrv.formConfig = this.formConfig
    this.entitySrv.colDef = this.colDef
    if(!this.gs.NavQueriesRead){
      this.baseQueries = this.gs.NavQueries
      this.gs.NavQueriesRead = true  
    } else {
      this.baseQueries = []
    }
    this.initDataSource()
    this.setSelectionItems()
  }

  initDataSource(additionalQueries?: QueryItem[]) {
    let allQueries: QueryItem[] = null
    if(this.baseQueries){
      allQueries = additionalQueries ? this.baseQueries.concat(additionalQueries) : this.baseQueries
    } else {
      allQueries = additionalQueries ? additionalQueries : null
    }
    if(allQueries && allQueries.length > 0){this.selectionActive = true}
    this.isLoading = true
    this.entitySrv.initEntity$(allQueries).takeUntil(this.ngUnsubscribe).subscribe((data: T) => {
      this.data = data
      this.dataLoaded.next()
      this.isLoading = false
    })
  }

  setPulldownItems(items$: Observable<any>, fldName: string, displayFld: string, subDisplayFld?: string, addSearchFld?: string) {
    items$.takeUntil(this.ngUnsubscribe).subscribe((items) => {
      // this.formConfig.find(c => {return c.name === fldName})['customLookupItems'] = items
      let customLookupItems = items
      .map((item) => {
        return {
          id: item.id,
          display: this.resolveObjPath(item, displayFld),
          subDisplay: subDisplayFld != undefined ? this.resolveObjPath(item, subDisplayFld) : '',
          addSearch: addSearchFld != undefined ? this.resolveObjPath(item, addSearchFld) : ''
        }
      })
      this.formConfig.find(c => {return c.name === fldName})['customLookupItems'] = customLookupItems
      this.formConfigInitial.find(c => {return c.name === fldName})['customLookupItems'] = customLookupItems //async not available at copy in init
    })
  }

  setLookupComponent(component: Type<any>, fldName: string, displayFld: string, subDisplayFld?: string, addSearchFld?: string) {
    let formConfig = this.formConfig.find(c => {return c.name === fldName})
    if(formConfig != undefined){
      formConfig['customLookupComponent'] = component
      formConfig['customLookupItem'] = {id: '', display: displayFld, subDisplay: subDisplayFld, addSearch: addSearchFld}  
    }
  }

  resolveObjPath(obj, path) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
  }

  setSelectionItems() {
    if(this.selectionFields.length > 0){
      this.selectionButton = true
      this.selectionFields.forEach(fld => {
        const formConfig = this.formConfig.find(fc => fc.name == fld.name)
        if(formConfig != undefined){
          const matchingBaseQuery = this.baseQueries.find(bq => bq.fld == fld.name)
          formConfig.value = matchingBaseQuery != undefined ? matchingBaseQuery.value : ''
          this.selectionFieldConfig.push(formConfig)
        }
      })
    }
  }

  clicked(brwClick: {fld: string, rec: {}}) {
    let rec = brwClick.fld == 'insert' ? {} : brwClick.rec
    if(!['insert','selection'].includes(brwClick.fld)){
      if(this.selectMode){
        this.gs.entityId[this.entitySrv.entityName] = rec['id']
        this.selected.emit(brwClick)
        this.dialogRef.close(rec)
      } else {
        this.formConfig = this.formConfigInitial.map(x => Object.assign({}, x));
        this.cs.changeDeleteDialog(this.formConfig, rec, this.entitySrv.entityPath, brwClick.fld, this['embeds'] ? this['embeds'] : undefined, this.alternativeFormActionTitle).catch(err => console.log(err))
      }
      return
    }    
    if(brwClick.fld == 'insert'){
      if(!this.userDefinedBrowse){
        this.formConfig.map(fld => fld.value = '')
      }
      this.formConfig = this.formConfigInitial.map(x => Object.assign({}, x));
      if(this.resetDoNotPopulate){this.formConfig.forEach(c => c.doNotPopulate = false)}
      this.cs.insertDialog(this.formConfig, rec, this.entitySrv.entityPath, this['embeds'] ? this['embeds'] : undefined, this.alternativeFormActionTitle).then(id => {this.isLoading = false}).catch(err => {this.isLoading = false; console.log(err)})
      return
    }
    if(brwClick.fld == 'selection'){
      this.selectionFieldConfig.forEach(config => this.db.getSetting(config.options).subscribe(setting => config.options = setting ? setting : config.options))
      this.ps.formDialog(0, this.selectionFieldConfig, rec).then((frmResult: {response: string, value: {}}) => {
        if(frmResult && (frmResult.response == 'save')){
          let addQs: QueryItem[] = []
          Object.keys(frmResult.value).forEach(frmFld => {
            addQs.push({fld: frmFld, operator: '==', value: frmResult.value[frmFld]})
          })
          this.initDataSource(addQs)
        }
        if(frmResult && (frmResult.response == 'delete')){
          this.formConfig.map(fld => fld.value = '')
          this.selectionActive = false
          this.initDataSource()
        }
      })
      return
    }
  }
  
  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
