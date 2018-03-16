import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, trigger, transition, style, animate, ViewChild } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Tile } from '../models/tile.model';

@Component({
  selector: 'app-grid',
  animations: [trigger('pageAnim', [transition(':enter', [style({transform: 'translateY(-100%)'}), animate(250)])])],
styles: [`
.container-title-text {margin-top:16px; margin-bottom:16px; font-size: calc(24px + 0.25vw)}
.container-title-icon {font-size: 40px; max-width: 40px; width: auto; margin-right: 15px}
.outer {white-space: nowrap; overflow-x:scroll;}
.inner {margin: 0 0.5% 0.5%; display: inline-block;}
.item-title {font-size: calc(16px + 0.25vw); line-height: calc(22px + 0.25vw); margin-bottom: 0}
`],
template: `
<div [@pageAnim] style="padding: 0px 5px; width:100%">
  <div fxLayout="row" fxLayoutAlign="start start" style="margin: 0 0.5%">
      <mat-icon *ngIf="titleIcon" fxFlex class="container-title-icon">{{titleIcon}}</mat-icon>
      <p fxFlex class="mat-display-1 container-title-text">{{title}}</p>
  </div>
  <div [ngClass]="{'outer': singleRow}">
    <div *ngFor="let tile of tiles" class="inner" [ngStyle]="getItemStyle()">
      <div fxLayout="column" fxLayoutAlign="start start" (click)="onClick(tile)">
        <div>
          <img src="{{tile.image}}" onerror="this.onerror=null;this.src='assets/image.svg'" [ngStyle]="getImageStyle()">
        </div>
        <div style="white-space:normal">
          <p class="mat-headline item-title"><b>{{tile.title}}</b></p>
        </div>
        <div>
          <p class="mat-body-2" style="line-height:18px; margin:0; white-space:pre-wrap;">{{tile.description}}</p>
          <p *ngIf="tile.price" class="mat-body-2" style="line-height:18px; margin:0; color:red">{{tile.price}} Punten</p>
        </div>
        <div *ngIf="buttonText" fxFlex="20" fxFlexAlign="start">
          <button mat-button color="primary"><mat-icon>{{buttonIcon}}</mat-icon>{{buttonText}}</button>
          <br/><br/>
        </div>
      </div>
    </div>
  </div>
</div>
`
})

export class GridComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject<string>()
  @Input() singleRow: boolean
  @Input() title: string
  @Input() titleIcon: string
  @Input() buttonText: string
  @Input() buttonIcon: string
  @Input() maxImageHeight: string
  @Input() maxItemWidth: string
  @Input() data: Tile[]
  @Output() clicked = new EventEmitter();
  tiles: Tile[]

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.loadData()
  }

  loadData() {
    this.tiles = this.data
    // console.log('tiles: ', this.tiles)
  }

  getItemStyle() {
    return {
      'max-width': this.maxItemWidth != undefined ? this.maxItemWidth + '%': '30%' // leave default at 30% for store module
    }
  }

  getImageStyle() {
    return {
      'max-width':'100%',
      'max-height': this.maxImageHeight != undefined ? this.maxImageHeight + 'vw' : '20vw'
    }
  }

  onClick(e) {
    this.clicked.emit(e)
  }
  setColumns() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
