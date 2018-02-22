import { Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { LookupItem } from '../../../shared/custom-components/models/lookup-item.model';
import { ColumnDefenition } from '../../../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';
import { SelectionField } from '../../dynamic-form/models/selection-field.interface';
import { QueryItem } from './query-item.interface';
import { DbService } from '../../../services/db.service';
import { PopupService } from '../../../services/popup.service';
import { GlobService } from '../../../services/glob.service';

import { EntityService } from './entity-service.interface';
import { CategoryService } from '../../../entities/tenants/categories/category.service';

export class BrwBaseClass<T> {
  @Input() select: boolean
  @Output() selected = new EventEmitter()
  data: T
  ngUnsubscribe = new Subject<string>()
  title = ''
  titleIcon = ''
  isLoading = true
  selectMode = false
  selectionButton = false
  selectionActive = false
  colDef: ColumnDefenition[]
  formConfig: FieldConfig[]
  selectionFields: SelectionField[] = []
  selectionFieldConfig: FieldConfig[] = []
  baseQueries: QueryItem[]

  constructor(
    private entitySrv: EntityService,
    private db: DbService,
    private ps: PopupService,
    private gs: GlobService
  ) {}

  ngOnInit() {
    this.selectMode = this.select
    this.entitySrv.formConfig = this.formConfig
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
    this.isLoading = true
    this.entitySrv.initEntity$(allQueries).takeUntil(this.ngUnsubscribe).subscribe((data: T) => {
      this.data = data
      this.isLoading = false
    })
  }

  setLookupItems(items$: Observable<any>, fldName: string, displayFld: string, subDisplayFld?: string, addSearchFld?: string) {
    items$.takeUntil(this.ngUnsubscribe).subscribe((items) => {
      this.formConfig.find(c => {return c.name === fldName})['customLookupItems'] = items
      .map((item) => {
        return {
          id: item.id,
          display: this.resolveObjPath(item, displayFld),
          subDisplay: subDisplayFld != undefined ? this.resolveObjPath(item, subDisplayFld) : '',
          addSearch: addSearchFld != undefined ? this.resolveObjPath(item, addSearchFld) : ''
        }
      })
    })    
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
        this.selectionFieldConfig.push(this.formConfig.find(fc => fc.name == fld.name))
      })
    }
  }

  clicked(brwClick: {fld: string, rec: {}}) {
    let rec = brwClick.fld == 'insert' ? {} : brwClick.rec
    if(!['insert','selection','select'].includes(brwClick.fld)){
      this.db.changeDeleteDialog(this.formConfig, rec, this.entitySrv.entityPath).catch(err => console.log(err))
      return
    }    
    if(brwClick.fld == 'insert'){
      this.formConfig.map(fld => fld.value = '')
      this.db.insertDialog(this.formConfig, rec, this.entitySrv.entityPath).then(id => {}).catch(err => console.log(err))
      return
    }
    if(brwClick.fld == 'selection'){
      this.ps.formDialog(0, this.selectionFieldConfig, rec).then((frmResult: {response: string, value: {}}) => {
        if(frmResult && (frmResult.response == 'save')){
          let addQs: QueryItem[] = []
          Object.keys(frmResult.value).forEach(frmFld => {
            addQs.push({fld: frmFld, operator: '==', value: frmResult.value[frmFld]})
          })
          if(addQs.length > 0){this.selectionActive = true}
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
    if(brwClick.fld == 'select'){
      this.gs.entityId[this.entitySrv.entityName] = rec['id']
      this.selected.emit(brwClick)
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
