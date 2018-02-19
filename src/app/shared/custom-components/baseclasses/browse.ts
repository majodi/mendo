import { Observable, Subject } from 'rxjs';

import { LookupItem } from '../../../shared/custom-components/models/lookup-item.model';
import { ColumnDefenition } from '../../../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';
import { DbService } from '../../../services/db.service';

import { EntityService } from './entity-service.interface';
import { CategoryService } from '../../../entities/tenants/categories/category.service';

export class BrwBaseClass<T> {
  data: T
  ngUnsubscribe = new Subject<string>()
  title = ''
  titleIcon = ''
  isLoading = true
  colDef: ColumnDefenition[]
  formConfig: FieldConfig[]

  constructor(
    private entitySrv: EntityService,
    private db: DbService,
  ) {}

  ngOnInit() {
    this.entitySrv.formConfig = this.formConfig
    this.entitySrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe((data: T) => {
      this.data = data
      this.isLoading = false
    })
  }

  setLookupItems(items$: Observable<any>, fldName: string, tblName: string, displayFld: string, subDisplayFld?: string, addSearchFld?: string) {
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

  clicked(brwClick: {fld: string, rec: {}}) {
    let rec = brwClick.fld == 'insert' ? {} : brwClick.rec
    if(brwClick.fld == 'insert'){
      this.formConfig.map(fld => fld.value = '')
      this.db.insertDialog(this.formConfig, rec, this.entitySrv.entityPath).then(id => {}).catch(err => console.log(err))
    } else {
      this.db.changeDeleteDialog(this.formConfig, rec, this.entitySrv.entityPath).catch(err => console.log(err))
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
