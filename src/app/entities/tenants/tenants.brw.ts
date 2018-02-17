import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { Tenant, defaultTitle, defaultTitleIcon, defaultColDef, defaultFormConfig, defaultEntityPath } from './tenant.model'
import { TenantService } from './tenant.service';
import { ColumnDefenition } from '../../shared/custom-components/models/column-defenition.model'
import { FieldConfig } from '../../shared/dynamic-form/models/field-config.interface';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-tenants-brw',
  template: `
  <app-table
    [title]="title"
    [titleIcon]="titleIcon"
    [isLoading]="isLoading"
    [data]="data"
    [columnDefs]="colDef"
    (clicked)="clicked($event)"
  ></app-table>  
  `,
  styles: [``]
})
export class TenantsBrwComponent implements OnInit, OnDestroy {
  data: Tenant[]
  private ngUnsubscribe = new Subject<string>()
  entityPath = defaultEntityPath
  title = defaultTitle
  titleIcon = defaultTitleIcon
  isLoading = true
  colDef: ColumnDefenition[]
  formConfig: FieldConfig[]

  constructor(
    private entitySrv: TenantService,
    private db: DbService
  ) {}

  ngOnInit() {
    this.entitySrv.initTenants$().takeUntil(this.ngUnsubscribe).subscribe(data => {
      this.data = data
      this.isLoading = false
    })
    this.colDef = defaultColDef
    this.formConfig = defaultFormConfig
    this.entityPath = this.entitySrv.entityPath
  }

  clicked(brwClick: {fld: string, rec: {}}) {
    if(brwClick.fld == 'insert'){
      this.db.insertDialog(this.formConfig, brwClick, this.entityPath).then(id => {}).catch(err => console.log(err))
    } else {
      this.db.changeDeleteDialog(this.formConfig, brwClick.rec, this.entityPath).catch(err => console.log(err))
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
