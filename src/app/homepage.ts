import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FieldConfig } from './shared/dynamic-form/models/field-config.interface';
import { Tile } from './shared/custom-components/models/tile.model';
import { BulletinService } from './entities/tenants/bulletins/bulletin.service';

@Component({
  selector: 'app-home',
  styles: [``],
  template: `
  <div style="width:100%">
  <app-grid
    [singleRow]="false"
    [title]="'Tenant Home'"
    [buttonIcon]="'open_in_browser'"
    [buttonText]="'Buttontext...'"
    [maxItemWidth]="'80'"
    [maxImageHeight]="'100'"
    [data]="bulletinData"
  ></app-grid>
  </div>
  `,
})
export class HomePageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<string>()
  bulletinData: Tile[]

  constructor(private BulletinSrv: BulletinService) {
    this.BulletinSrv.colDef = [{name: 'image_v'}]
    this.BulletinSrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.BulletinSrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe(bulletins => {
      this.bulletinData = bulletins.map(bulletin => {
        return {
          id: bulletin.id,
          title: bulletin.title,
          image: bulletin.image_v,
          description: bulletin.text
        }  
      })
    })
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()    
  }

}
