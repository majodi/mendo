
import {takeUntil} from 'rxjs/operators'
import { Input, Output, EventEmitter, Type, Inject, Injector, OnInit, OnDestroy } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material'
import { ActivatedRoute } from '@angular/router'

// import { LookupItem } from '../../../shared/custom-components/models/lookup-item.model';
import { ColumnDefenition } from '../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface'
import { SelectionField } from '../shared/dynamic-form/models/selection-field.interface'
import { QueryItem } from '../models/query-item.interface'
import { DbService } from '../services/db.service'
import { PopupService } from '../services/popup.service'
import { GlobService } from '../services/glob.service'
import { UploadService } from '../services/upload.service'
import { CrudService } from '../services/crud.service'

import { EntityService } from '../models/entity-service.interface'
import { SortOrder } from '../shared/custom-components/models/sort-order.model'

export class BrwBaseClass<T> implements OnInit, OnDestroy {
  @Input() select: boolean
  @Input() sober: boolean
  @Input() itemSelect: boolean
  @Output() selected = new EventEmitter()
  data: T[]
  initialSortOrder: SortOrder
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
  itemSelectParent: string
  itemSelectEntity: string
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
    this.formConfigInitial = this.formConfig.map(x => Object.assign({}, x))
    this.selectMode = this.select
    this.soberMode = this.sober
    this.entitySrv.formConfig = this.formConfig
    this.entitySrv.colDef = this.colDef
    if (!this.gs.NavQueriesRead) {
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
    if (this.baseQueries) {
      allQueries = additionalQueries ? this.baseQueries.concat(additionalQueries) : this.baseQueries
    } else {
      allQueries = additionalQueries ? additionalQueries : null
    }
    if (allQueries && allQueries.length > 0) {this.selectionActive = true}
    this.isLoading = true
    this.entitySrv.initEntity$(allQueries).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: T[]) => {
      this.data = data
      this.dataLoaded.next()
      this.isLoading = false
    })
  }

  setPulldownItems(items$: Observable<any>, fldName: string, displayFld: string, subDisplayFld?: string, addSearchFld?: string) {
    items$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      // this.formConfig.find(c => {return c.name === fldName})['customLookupItems'] = items
      const customLookupItems = items
      .map((item) => {
        return {
          id: item.id,
          display: this.resolveObjPath(item, displayFld),
          subDisplay: subDisplayFld !== undefined ? this.resolveObjPath(item, subDisplayFld) : '',
          addSearch: addSearchFld !== undefined ? this.resolveObjPath(item, addSearchFld) : ''
        }
      })
      this.formConfig.find(c => c.name === fldName)['customLookupItems'] = customLookupItems
      this.formConfigInitial.find(c => c.name === fldName)['customLookupItems'] = customLookupItems // async not available at copy in init
    })
  }

  setLookupComponent(component: Type<any>, fldName: string, displayFld: string, subDisplayFld?: string, addSearchFld?: string) {
    const formConfig = this.formConfig.find(c => c.name === fldName)
    if (formConfig !== undefined) {
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
    if (this.selectionFields.length > 0) {
      this.selectionFields.forEach(fld => {
        if (fld.minimumLevel === undefined || this.gs.activeUser.level >= fld.minimumLevel) {
          const formConfig = this.formConfig.find(fc => fc.name === fld.name)
          if (formConfig !== undefined) {
            formConfig.doNotPopulate = false // !!!!!!
            const matchingBaseQuery = this.baseQueries.find(bq => bq.fld === fld.name)
            formConfig.value = matchingBaseQuery !== undefined ? matchingBaseQuery.value : ''
            if (fld.disabled !== undefined) {formConfig.disabled = fld.disabled }
            this.selectionFieldConfig.push(formConfig)
          }
        }
      })
      this.selectionButton = this.selectionFieldConfig.length > 0 ? true : false
    }
  }

  clicked(brwClick: {fld: string, rec: {}, itemSelection: {}[]}) {
    const rec = brwClick.fld === 'insert' ? {} : brwClick.rec
    if (!['insert', 'selection', 'acceptItemSelect', 'header'].includes(brwClick.fld)) {
      if (this.selectMode) {
        this.gs.entityId[this.entitySrv.entityName] = rec['id']
        this.selected.emit(brwClick)
        this.dialogRef.close(rec)
      } else {
        this.formConfig.forEach(c => this.formConfigInitial.find(ic => ic.name === c.name).value = c.value) // retain original values (o.a. wanneer na-ijlende images in user defined forms)
        this.formConfig = this.formConfigInitial.map(x => Object.assign({}, x))
        this.setParentId(rec['id'])
        this.cs.changeDeleteDialog(this.formConfig, rec, this.entitySrv.entityPath, brwClick.fld, this['embeds'] ? this['embeds'] : undefined, this.alternativeFormActionTitle).catch(err => console.log(err))
      }
      return
    }
    if (brwClick.fld === 'insert') {
      if (!this.userDefinedBrowse) {
        // normaal values empty bij insert maar niet bij userdefined
        this.formConfig.map(fld => fld.value = '')
      }
      this.formConfig.forEach(c => this.formConfigInitial.find(ic => ic.name === c.name).value = c.value) // retain original values (o.a. wanneer na-ijlende images in user defined forms)
      this.formConfig = this.formConfigInitial.map(x => Object.assign({}, x))
      this.setParentId(rec['id'])
      if (this.resetDoNotPopulate) {this.formConfig.forEach(c => c.doNotPopulate = false)}
      this.cs.insertDialog(this.formConfig, rec, this.entitySrv.entityPath, this['embeds'] ? this['embeds'] : undefined, this.alternativeFormActionTitle)
      .then(id => {this.isLoading = false})
      .catch(err => {this.isLoading = false; console.log(err)})
      return
    }
    if (brwClick.fld === 'selection') {
      this.selectionFieldConfig.forEach(config => this.db.getSetting(config.options).subscribe(setting => config.options = setting ? setting : config.options))
      this.ps.formDialog(0, this.selectionFieldConfig, rec).then((frmResult: {response: string, value: {}}) => {
        if (frmResult && (frmResult.response === 'save')) {
          const addQs: QueryItem[] = []
          Object.keys(frmResult.value).forEach(frmFld => {
            addQs.push({
              fld: frmFld, operator: '==',
              value: frmResult.value[frmFld],
              valueIsPk: this.selectionFields.find(sf => sf.name === frmFld).valueIsPk,
              foreignkeyObject: this.selectionFields.find(sf => sf.name === frmFld).foreignkeyObject
            })
          })
          this.initDataSource(addQs)
        }
        if (frmResult && (frmResult.response === 'delete')) {
          this.formConfig.map(fld => fld.value = '')
          this.selectionActive = false
          this.initDataSource()
        }
      })
      return
    }
    if (brwClick.fld === 'acceptItemSelect' && brwClick.itemSelection !== undefined) {
      this.ps.buttonDialog('Selectie toepassen?', 'Pas toe', 'Annuleer').then(b => {
        if (b === 1) {
          this.isLoading = true
          let currentlyChild: boolean, nowSelected: boolean
          const promises = []
          this.data.forEach(currentRec => {
            currentlyChild = currentRec[this.itemSelectEntity] !== undefined ? (currentRec[this.itemSelectEntity][this.itemSelectParent] ? currentRec[this.itemSelectEntity][this.itemSelectParent] : false) : false
            nowSelected = brwClick.itemSelection.find(i => i['id'] === currentRec['id']) !== undefined
            if (nowSelected !== currentlyChild) {
              const currentChildOf = currentRec[this.itemSelectEntity] !== undefined ? currentRec[this.itemSelectEntity] : {}
              currentChildOf[this.itemSelectParent] = nowSelected
              const childOfData = {}
              childOfData[this.itemSelectEntity] = currentChildOf
              promises.push(
                this.db.setDoc(childOfData, `${this.entitySrv.entityPath}/${currentRec['id']}`, {merge: true})
              )
            }
          })
          const processed = promises.length
          Promise.all(promises).then(() => {
            this.isLoading = false
            this.dialogRef.close(processed)
          }).catch(e => {
            this.isLoading = false
            this.ps.buttonDialog('Fout bij toepassen selectie ' + e, 'OK').then(() => {
              this.dialogRef.close('Fout opgetreden, ?')
            })
          })
        }
      })
    }
    if (brwClick.fld === 'header') {
      console.log('header: ', rec['col'])
    }
  }

  setParentId(parentId) {
    this.formConfig.filter(c => c.type === 'selectchildren').forEach(c => c.customSelectChildrenCurrentParent = parentId)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

}
