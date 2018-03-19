import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
    [buttonIcon]="'open_in_browser'"
    [maxItemWidth]="'80'"
    [maxImageHeight]="'100'"
    [data]="bulletinData"
    (buttonClicked)="onButtonClicked($event)"
  ></app-grid>
  </div>
  `,
})
export class HomePageComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<string>()
  bulletinData: Tile[]

  constructor(private BulletinSrv: BulletinService, private router: Router) {
    this.BulletinSrv.colDef = [{name: 'image_v'}]
    this.BulletinSrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.BulletinSrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe(bulletins => {
      this.bulletinData = bulletins.map(bulletin => {
        return {
          id: bulletin.id,
          title: bulletin.title,
          image: bulletin.image_v,
          description: bulletin.text,
          buttonText: bulletin.buttonText,
          buttonLink: bulletin.buttonLink
        }  
      })
    })
  }

  ngOnInit() {}

  onButtonClicked(e) {
    // console.log('e: ', e['buttonLink'])
    this.router.navigate([e['buttonLink']])
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()    
  }

}
