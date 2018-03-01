import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, trigger, transition, style, animate, ViewChild } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Tile } from '../models/tile.model';

@Component({
  selector: 'app-grid',
  animations: [trigger('pageAnim', [transition(':enter', [style({transform: 'translateY(-100%)'}), animate(250)])])],
  styles: [`
  .title-icon {font-size: 40px; max-width: 40px; width: auto; margin-right: 15px}
  `],
  template: `
  <div [@pageAnim] style="padding: 0px 5px">
    <div fxLayout="row" fxLayoutAlign="start start">
        <mat-icon fxFlex="noshrink" class="title-icon">{{titleIcon}}</mat-icon>
        <h1 fxFlex class="mat-display-1">{{title}}</h1>
    </div>
    <mat-grid-list cols="4">
      <mat-grid-tile *ngFor="let tile of tiles">
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{tile.title}}</mat-card-title>
            <mat-card-subtitle>{{tile.description}}</mat-card-subtitle>
          </mat-card-header>
          <img mat-card-image src="{{tile.image}}" onerror="this.onerror=null;this.src='assets/image.svg'">
          <mat-card-actions>
            <button mat-button>Bestel</button>
          </mat-card-actions>
        </mat-card>
      </mat-grid-tile>
    </mat-grid-list>
  </div>
  `
})

export class GridComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject<string>()
  @Input() title: string
  @Input() titleIcon: string
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
    console.log('tiles data: ', this.tiles)
  }

  setColumns() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
