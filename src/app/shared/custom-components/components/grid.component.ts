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
.badge {margin: 0px; padding: 2px 6px 0px; border: 1px solid black; color: white; border-radius: 20px 20px; background: red; width: 10px; height: 20px;}
`],
template: `
<div [@pageAnim] style="padding: 0px 5px; width:100%">
  <div fxLayout="row" fxLayoutAlign="start center" style="margin: 0 0.5% 1%">
    <mat-icon *ngIf="titleIcon" class="container-title-icon">{{titleIcon}}</mat-icon>
    <p class="mat-display-1 container-title-text">{{title}}</p>
    <mat-form-field *ngIf="showFilter" fxFlex="40" style="margin-left:2vw">
      <input matInput (keyup)="filterKeyUp.next($event.target.value)" placeholder="Filter">
    </mat-form-field>
    <div *ngIf="actionButtonIcon" fxLayout="row" fxLayoutAlign="start center" (click)="onActionButtonClick('action')" style="margin-left: 2vw">
      <button mat-fab color="primary"><mat-icon>{{actionButtonIcon}}</mat-icon></button>
      <p fxFlexAlign="start" class="badge">{{actionButtonInfo}}</p>
    </div>
  </div>
  <div [ngClass]="{'outer': singleRow}">
    <div *ngFor="let tile of tiles" class="inner" [ngStyle]="getItemStyle()">
      <div fxLayout="column" fxLayoutAlign="start center" (click)="onClick(tile)">
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
        <div *ngIf="buttonText || tile.buttonText" fxFlex="20" fxFlexAlign="start">
          <button mat-button color="primary" (click)="onButtonClick(tile, $event)"><mat-icon>{{buttonIcon}}</mat-icon>{{tile.buttonText ? tile.buttonText : buttonText}}</button>
          <br/><br/>
        </div>
      </div>
      <div *ngIf="divider">
        <hr>
        <br>
      </div>
    </div>
  </div>
</div>
`
})

export class GridComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject<string>()
  filterKeyUp = new Subject<string>()
  @Input() singleRow: boolean
  @Input() title: string
  @Input() titleIcon: string
  @Input() buttonText: string
  @Input() buttonIcon: string
  @Input() maxImageHeight: string
  @Input() maxItemWidth: string
  @Input() data: Tile[]
  @Input() showFilter: boolean
  @Input() actionButtonIcon: string
  @Input() actionButtonInfo: string
  @Input() divider: boolean
  @Output() clicked = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();
  @Output() actionButtonClicked = new EventEmitter();
  tiles: Tile[]

  constructor() {}

  ngOnInit() {
    this.filterKeyUp
    .takeUntil(this.ngUnsubscribe)
    .debounceTime(400)
    .distinctUntilChanged()
    .subscribe(v => this.applyFilter(v))
  }

  ngOnChanges() {
    this.loadData()
  }

  loadData() {
    this.tiles = this.data
  }

  applyFilter(filter) {
    this.tiles = this.data.filter(item => {
      let flatDataStr = ''
      Object.keys(item).filter(v => !['id','meta'].includes(v)).map(l1 => {
              if(typeof item[l1] == 'object' && item[l1] != null) {
                  Object.keys(item[l1]).map(l2 => flatDataStr += item[l1][l2] ? item[l1][l2] : '')
              } else {flatDataStr += item[l1] ? item[l1] : ''}  
      })      
      return flatDataStr.toLowerCase().indexOf(filter.trim().toLowerCase()) != -1;    
    })
  }

  getItemStyle() {
    return {
      'width': '100%',
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

  onButtonClick(e, event?) {
    this.buttonClicked.emit(e)
    if(event != undefined){
      event.preventDefault();
      event.stopPropagation();  
    }
  }

  onActionButtonClick(e) {
    this.actionButtonClicked.emit(e)
  }
  
  setColumns() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
