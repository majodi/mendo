import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, trigger, transition, style, animate, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

import { Observable, Subject } from 'rxjs';

import { ColumnDefenition } from '../models/column-defenition.model'
// import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'app-table',
  animations: [trigger('pageAnim', [transition(':enter', [style({transform: 'translateY(-100%)'}), animate(250)])])],
  styles: [`
  .mat-table {overflow: auto;}
  .page-header {height: 90px; padding: 8px 24px 0;}
  .mat-cell, .mat-header-cell {display: inline-block; word-wrap: normal; margin-right: 5px;}
  .gradient-bg {background-image: url("./assets/gradient_bg.png"); background-repeat: repeat-x;}
  .title-icon {font-size: 40px; max-width: 40px; width: auto;}
    `],
  template: `
  <div [@pageAnim]>
    <mat-card class="gradient-bg">
        <div fxLayout="column">
        <div class="page-header" fxLayout="row" fxLayoutAlign="space-around start">
            <div *ngIf="!mediaLtMd" fxFlex="20" fxLayout="row" fxLayoutAlign="start start">
                <mat-icon fxFlex="noshrink" class="title-icon">{{titleIcon}}</mat-icon>
                <h1 fxFlex class="mat-display-1">{{title}}</h1>
            </div>
            <mat-form-field fxFlex>
                <input matInput (keyup)="filterKeyUp.next($event.target.value)" placeholder="Filter">
            </mat-form-field>
            <button fxFlex="20" fxFlexAlign="center" [fxFlexOffset]="5" mat-raised-button (click)="click('insert','')">Nieuw</button>
        </div>
        <!-- table -->
        <mat-table #table [dataSource]="dataSource" matSort style="max-height:50vh;">
            <ng-container *ngFor="let col of columnDefs" [matColumnDef]="col.name">
                <mat-header-cell [fxFlex]="col.flex" *matHeaderCellDef mat-sort-header [disabled]="!col.sort"> {{col.header}} </mat-header-cell>
                <mat-cell [fxFlex]="col.flex" *matCellDef="let rec" (click)="click(col.name, rec)">
                    <ng-container *ngIf="col.icon || col.iconSelect; then icon_tpl else field_tpl"></ng-container>
                        <ng-template #icon_tpl>
                            <mat-icon *ngIf="col.icon" color="primary">
                                {{col.icon}}
                            </mat-icon>
                            <mat-icon *ngIf="!col.icon && col.iconSelect" color="primary">
                                {{col.iconSelect(rec)}}
                            </mat-icon>
                        </ng-template>
                        <ng-template #field_tpl>
                            <ng-container *ngIf="col.format; then formatted_tpl else unformatted_tpl"></ng-container>
                                <ng-template #formatted_tpl>{{col.format(rec)}}</ng-template>
                                <ng-template #unformatted_tpl>{{resolveObjPath(rec, col.name)}}</ng-template>
                        </ng-template>
                </mat-cell>
            </ng-container>
            <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
        <mat-spinner *ngIf="isLoading" style="margin:15vw" fxFlexAlign="center"></mat-spinner>
        </div>
    </mat-card>
  </div>
  `
})

export class TableComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject<string>()
  filterKeyUp = new Subject<string>()
  dataSource: MatTableDataSource<any>
  @ViewChild(MatSort) sort: MatSort

  @Input() title: string
  @Input() titleIcon: string
  @Input() selectMode: boolean
  @Input() backRoute: string
  @Input() isLoading = true
  @Input() data = []
  @Input() columnDefs: ColumnDefenition[] = []
  @Output() clicked = new EventEmitter();
  displayedColumns = []
  mediaIsXs: boolean
  mediaLtMd: boolean

  constructor(
    public media: ObservableMedia,
    // private ps: PopupService
  ) {
    this.mediaIsXs = this.media.isActive('xs')
    this.mediaLtMd = this.media.isActive('lt-md')

    media.asObservable().takeUntil(this.ngUnsubscribe).subscribe((change: MediaChange) => {
        if ( this.media.isActive('lt-md') != this.mediaLtMd) {this.mediaLtMd = this.media.isActive('lt-md')}
        if ( this.media.isActive('xs') != this.mediaIsXs) {
            this.mediaIsXs = this.media.isActive('xs')
            this.setColumns()
        }
      })        
  }

  ngOnInit() {
    this.filterKeyUp
    .takeUntil(this.ngUnsubscribe)
    .debounceTime(400)
    .distinctUntilChanged()
    .subscribe(v => this.applyFilter(v))
  }

  ngOnChanges() {
      this.setColumns()
  }

  setColumns() {
    this.displayedColumns = []
    this.columnDefs.forEach(coldef => {
        if(!(this.media.isActive('xs') && coldef.hideXs)) {
            this.displayedColumns.push(coldef.name)
        }
        coldef.header = coldef.header || coldef.name
    })
    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.sort = this.sort;
  }

  resolveObjPath(obj, path) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
  }

  click(fld, rec) {
    this.clicked.emit({fld: fld, rec:rec})
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim()
    filterValue = filterValue.toLowerCase()
    this.dataSource.filter = filterValue
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }  

}
