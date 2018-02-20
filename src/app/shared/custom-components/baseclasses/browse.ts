import { Observable, Subject } from 'rxjs';

import { LookupItem } from '../../../shared/custom-components/models/lookup-item.model';
import { ColumnDefenition } from '../../../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';
import { SelectionField } from '../../dynamic-form/models/selection-field.interface';
import { DbService } from '../../../services/db.service';
import { PopupService } from '../../../services/popup.service';

import { EntityService } from './entity-service.interface';
import { CategoryService } from '../../../entities/tenants/categories/category.service';

export class BrwBaseClass<T> {
  data: T
  ngUnsubscribe = new Subject<string>()
  title = ''
  titleIcon = ''
  isLoading = true
  selectionButton = false
  colDef: ColumnDefenition[]
  formConfig: FieldConfig[]
  selectionFields: SelectionField[] = []
  selectionFieldConfig: FieldConfig[] = []

  constructor(
    private entitySrv: EntityService,
    private db: DbService,
    private ps: PopupService
  ) {}

  ngOnInit() {
    this.entitySrv.formConfig = this.formConfig
    this.entitySrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe((data: T) => {
      this.data = data
      this.isLoading = false
    })
    this.setSelectionItems()
  }

  setLookupItems(items$: Observable<any>, fldName: string, displayFld: string, subDisplayFld?: string, addSearchFld?: string) {
    items$.takeUntil(this.ngUnsubscribe).subscribe((items) => {
      this.formConfig.find(c => {return c.name === fldName})['customLookupItems'] = items
      .map((item) => {
        return {
          id: item.id,
          display: item[displayFld],
          subDisplay: subDisplayFld != undefined ? item[subDisplayFld] : '',
          addSearch: addSearchFld != undefined ? item[addSearchFld] : ''
        }
      })
    })    
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
    if(!['insert','selection'].includes(brwClick.fld)){
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
          this.isLoading = true
          this.entitySrv.initEntity$(frmResult.value).takeUntil(this.ngUnsubscribe).subscribe((data: T) => {
            this.data = data
            this.isLoading = false
          })      
        }
        if(frmResult && (frmResult.response == 'delete')){
          this.formConfig.map(fld => fld.value = '')          
          this.isLoading = true
          this.entitySrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe((data: T) => {
            this.data = data
            this.isLoading = false
          })      
        }
      })
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
