
import {distinctUntilChanged, debounceTime, takeUntil} from 'rxjs/operators'
import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { trigger, transition, style, animate } from '@angular/animations'
import { MatTableDataSource, MatSort } from '@angular/material'
import { ObservableMedia, MediaChange } from '@angular/flex-layout'

import { Observable, Subject } from 'rxjs'

import { UploadService } from '../../../services/upload.service'
import { ColumnDefenition } from '../models/column-defenition.model'
import { SelectionModel } from '@angular/cdk/collections'
import { SortOrder } from '../models/sort-order.model'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-table',
  animations: [trigger('pageAnim', [transition(':enter', [style({transform: 'translateY(-100%)'}), animate(250)])])],
  styles: [`
  .mat-table {overflow: auto;}
  .page-header {height: 90px; padding: 8px 24px 0;}
  .mat-cell, .mat-header-cell {display: inline-block; word-wrap: normal; margin-right: 5px;}
  .gradient-bg {background-image: url("./assets/gradient_bg.png"); background-repeat: repeat-x;}
  .title-icon {font-size: 40px; max-width: 40px; width: auto;}
  .lg-button {min-width: 100px; padding: 0;}
  .mat-column-select {overflow: visible;}
    `],
  template: `
  <div [@pageAnim]>
  <mat-card class="gradient-bg">
      <div fxLayout="column">
      <div *ngIf="!soberMode" class="page-header" fxLayout="row" fxLayoutAlign="space-around start">
          <div *ngIf="!mediaLtMd" fxFlex="30" fxLayout="row" fxLayoutAlign="start start">
              <mat-icon fxFlex="noshrink" class="title-icon">{{titleIcon}}</mat-icon>
              <h1 fxFlex class="mat-display-1">{{title}}</h1>
          </div>
          <mat-form-field fxFlex="40">
              <input matInput (keyup)="filterKeyUp.next($event.target.value)" placeholder="Filter">
          </mat-form-field>
          <div fxFlex="15" fxFlexAlign="center" fxLayout="row" fxLayoutAlign="space-around start">
            <button mat-button style="min-width:40px; padding:5%;" (click)="print()"><mat-icon>print</mat-icon></button>
            <button mat-button style="min-width:40px; padding:5%;" (click)="download()"><mat-icon>cloud_download</mat-icon></button>
          </div>
          <div fxFlex="15" [fxFlexOffset]="5" fxLayout="column" fxLayoutAlign="space-between stretch">
              <button class="lg-button" *ngIf="insertButton && !itemSelect" mat-button accesskey="n" (click)="click('insert','')"><mat-icon>create</mat-icon>{{buttonText_Nieuw}}</button>
              <button *ngIf="itemSelect && itemSelection.selected.length > 0" class="lg-button" mat-button (click)="click('acceptItemSelect','')"><mat-icon>playlist_add_check</mat-icon>{{buttonText_Kies}}</button>
              <button class="lg-button" *ngIf="selectionButton" mat-button (click)="click('selection','')" [color]="selectionButtonColor"><mat-icon>filter_list</mat-icon>{{buttonText_Selectie}}</button>
          </div>
      </div>
      <div *ngIf="soberMode" class="page-header" style="padding: 0px">
          <div fxLayout="row" fxLayoutAlign="start start">
              <h1 fxFlex class="mat-display-1">{{title}}</h1>
          </div>
      </div>
      <!-- table -->
      <div #printarea>
      <mat-table #table [dataSource]="dataSource" matSort style="max-height:50vh;">
        <ng-container *ngIf="itemSelect" matColumnDef="select">
            <mat-header-cell *matHeaderCellDef>
            <mat-checkbox (change)="$event ? masterToggle() : null"
                        [checked]="itemSelection.hasValue() && isAllSelected()"
                        [indeterminate]="itemSelection.hasValue() && !isAllSelected()">
            </mat-checkbox>
            </mat-header-cell>
            <mat-cell *matCellDef="let row">
            <mat-checkbox (click)="$event.stopPropagation()"
                        (change)="$event ? itemSelection.toggle(row) : null"
                        [checked]="itemSelection.isSelected(row)">
            </mat-checkbox>
            </mat-cell>
        </ng-container>
          <ng-container *ngFor="let col of columnDefs" [matColumnDef]="col.name">
              <ng-container *ngIf="col.headerSelect; then headerSelect_tpl else noHeaderSelect_tpl"></ng-container>
              <ng-template #headerSelect_tpl>
                <mat-header-cell [fxFlex]="col.flex" *matHeaderCellDef mat-sort-header [disabled]="!col.sort">
                <mat-select [placeholder]="col.header" style="text-align: left; width: 80%" [(value)]="col.headerSelectValue">
                <mat-option *ngFor="let hchoice of col.headerSelect" [value]="hchoice.value">
                  {{ hchoice.viewValue }}
                </mat-option>
              </mat-select>
                </mat-header-cell>
              </ng-template>
              <ng-template #noHeaderSelect_tpl>
                <mat-header-cell [fxFlex]="col.flex" *matHeaderCellDef mat-sort-header [disabled]="!col.sort"> {{col.header}} </mat-header-cell>
              </ng-template>
              <mat-cell [fxFlex]="col.flex" *matCellDef="let rec" (click)="click(col.name, rec)" [ngStyle]="col.fldStyleSelect ? col.fldStyleSelect(rec) : {}">
                  <ng-container *ngIf="col.imageSelect; then image_tpl else noImage_tpl"></ng-container>
                      <ng-template #image_tpl>
                          <img src="{{getSetThumb(col, rec)}}" onerror="this.onerror=null;this.src='assets/image.svg'" width="64">
                      </ng-template>
                      <ng-template #noImage_tpl>
                          <ng-container *ngIf="col.icon || col.iconSelect; then icon_tpl else field_tpl"></ng-container>
                              <ng-template #icon_tpl>
                                  <mat-icon *ngIf="col.icon" [ngStyle]="col.fldStyleSelect ? col.fldStyleSelect(rec) : {'color': '#3f51b5'}">
                                      {{col.icon}}
                                  </mat-icon>
                                  <mat-icon *ngIf="!col.icon && col.iconSelect" [ngStyle]="col.fldStyleSelect ? col.fldStyleSelect(rec) : {'color': '#3f51b5'}">
                                      {{col.iconSelect(rec)}}
                                  </mat-icon>
                              </ng-template>
                              <ng-template #field_tpl>
                                  <ng-container *ngIf="col.format; then formatted_tpl else unformatted_tpl"></ng-container>
                                  <ng-template #formatted_tpl>{{col.format(rec, col.headerSelectValue)}}</ng-template>
                                  <ng-template #unformatted_tpl>{{resolveObjPath(rec, col.name)}}</ng-template>
                              </ng-template>
                      </ng-template>
              </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>
      </div>
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
  @ViewChild('printarea') private printAreaRef: ElementRef

  @Input() title: string
  @Input() titleIcon: string
  @Input() selectMode: boolean
  @Input() soberMode: boolean
  @Input() backRoute: string
  @Input() isLoading = true
  @Input() insertButton = true
  @Input() selectionButton = false
  @Input() selectionActive = false
  @Input() itemSelect = false
  @Input() itemSelectEntity
  @Input() itemSelectParent
  @Input() data = []
  @Input() columnDefs: ColumnDefenition[] = []
  @Input() initialSortOrder: SortOrder // = {fld: undefined, sortOrder: undefined}
  @Input() parentPrintHeaderRef: ElementRef
  @Output() clicked = new EventEmitter()
  itemSelection = new SelectionModel<Element>(true, [])
  displayedColumns = []
  mediaIsXs: boolean
  mediaLtMd: boolean
  selectionButtonColor = ''
  buttonText_Nieuw = 'Nieuw'
  buttonText_Kies = 'Kies'
  buttonText_Selectie = 'Selectie'
  initialSortDone = false

  constructor(
    public media: ObservableMedia,
    private as: AuthService,
    private us: UploadService,
  ) {
    this.mediaIsXs = this.media.isActive('xs')
    this.mediaLtMd = this.media.isActive('lt-md')

    media.asObservable().pipe(takeUntil(this.ngUnsubscribe)).subscribe((change: MediaChange) => {
        if ( this.media.isActive('lt-md') !== this.mediaLtMd) {this.mediaLtMd = this.media.isActive('lt-md')}
        if ( this.media.isActive('xs') !== this.mediaIsXs) {
            this.mediaIsXs = this.media.isActive('xs')
            this.setColumns()
        }
      })
  }

  ngOnInit() {
    //   this.itemSelect = true // test purpose
    this.filterKeyUp.pipe(
    takeUntil(this.ngUnsubscribe),
    debounceTime(400),
    distinctUntilChanged(), )
    .subscribe(v => this.applyFilter(v))
  }

  ngOnChanges() {
      this.columnDefs.forEach(cd => {
        if (cd.headerSelectValue) { cd.headerSelectValue = '' }
      })
      this.setColumns()
      this.selectionButtonColor = this.selectionActive ? 'warn' : ''
  }

  setColumns() {
    if (this.media.isActive('xs')) {
      this.buttonText_Nieuw = ''
      this.buttonText_Kies = ''
      this.buttonText_Selectie = ''
    } else {
      this.buttonText_Nieuw = 'Nieuw'
      this.buttonText_Kies = 'Kies'
      this.buttonText_Selectie = 'Selectie'
    }
    this.displayedColumns = this.itemSelect ? ['select'] : []
    this.columnDefs.forEach(coldef => {
        if (!(this.media.isActive('xs') && coldef.hideXs) && this.requiredModules(coldef.requiredModules)) {
            this.displayedColumns.push(coldef.name)
        }
        coldef.header = coldef.header || coldef.name
    })
    this.dataSource = new MatTableDataSource(this.data)
    if (this.data !== undefined && this.initialSortOrder !== undefined && !this.initialSortDone) {
      this.sort.sort(
        {id: this.initialSortOrder.fld, start: this.initialSortOrder.sortOrder, disableClear: true}
      )
      this.initialSortDone = true
    }
    this.dataSource.sort = this.sort
    this.dataSource.sortingDataAccessor = (item, property) => {
      return property.indexOf('.') === -1 ? item[property] : item[property.split('.')[0]][property.split('.')[1]]
    }
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
        let flatDataStr = ''
        Object.keys(data).filter(v => !['id', 'meta'].includes(v)).map(l1 => {
                if (typeof data[l1] === 'object' && data[l1] != null) {
                    Object.keys(data[l1]).map(l2 => flatDataStr += data[l1][l2] ? data[l1][l2] : '')
                } else {flatDataStr += data[l1] ? data[l1] : ''}
        })
        return flatDataStr.toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
      }
    if (this.data !== undefined) {
      this.data.filter(rec => rec[this.itemSelectEntity] && rec[this.itemSelectEntity][this.itemSelectParent]).forEach(row => this.itemSelection.select(row))
      this.isLoading = false
    }
}

  requiredModules(requiredModules) {
    if (requiredModules === undefined) {
      return true
    } else {
      return requiredModules.every(v => this.as.tenantModules.includes(v))
    }
  }

  isAllSelected() {
    const numSelected = this.itemSelection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  masterToggle() {
    this.isAllSelected() ?
        this.itemSelection.clear() :
        this.dataSource.data.forEach(row => this.itemSelection.select(row))
  }

  resolveObjPath(obj, path) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
  }

  getSetThumb(colDef, rec) {
      this.us.setThumb(rec[colDef.imageIdField]) // kan weg...
      // console.log('image: ', rec)
      return colDef.imageSelect(rec)
  }

  onBlurInp(e) {
    // console.log('onblurinp: ', e)
  }

  click(fld, rec) {
    this.clicked.emit({fld: fld, rec: rec, itemSelection: this.itemSelection.selected})
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue
  }

  print() {
    let popupWin
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto')
    popupWin.document.open()
    popupWin.document.write(`
      <html>
        <head>
          <title>Mendo: ${this.title}</title>
          <style type="text/css">
          body{
            font-family:Roboto,"Helvetica Neue",sans-serif;
          }
          .mat-sort-header-button{
            width: 240px;
            font-size: 24px;
            padding-left: 0px;
            margin-right: 1em;
            margin-bottom: 1em;
            text-align: left;
          }
          .mat-cell{
            width: 250px;
            word-break: break-all;
            line-height: 1em;
            margin-bottom: 1em;
            margin-right: 1em;
          }
          .mat-icon-button{
            display:none
          }
          </style>
        </head>
        <body>${this.parentPrintHeaderRef !== undefined ? this.parentPrintHeaderRef.nativeElement.innerHTML : ''}${this.printAreaRef.nativeElement.innerHTML}</body>
      </html>`
    )
    popupWin.onload = () => {
      setTimeout(function() {setTimeout(() => {popupWin.print()}, 100)}, 1500)
      // setTimeout(function() {setTimeout(() => {popupWin.close()}, 100)}, 15000) // for IOS, which doesn't have the afterprint event
    }
    popupWin.onafterprint = () => {popupWin.close()}
    popupWin.document.close()
  }

  download() {
    let str = ''; const fields: {name: string, format: Function, colval: string}[] = []
    for (let i = 0; i < this.columnDefs.length; i++) {
      if (!this.columnDefs[i].icon && !this.columnDefs[i].iconSelect) {
        // const headerSelect = this.columnDefs[i].headerSelect !== undefined ? this.columnDefs[i].headerSelect.find(hs => hs.value === this.columnDefs[i].headerSelectValue).viewValue : this.columnDefs[i].header
        const headerSelect = this.columnDefs[i].headerSelect !== undefined ? this.columnDefs[i].headerSelect.find(hs => hs.value === this.columnDefs[i].headerSelectValue) : undefined
        const header = headerSelect !== undefined ? headerSelect.viewValue : this.columnDefs[i].header
        fields.push({name: this.columnDefs[i].name, format: this.columnDefs[i].format, colval: this.columnDefs[i].headerSelectValue})
        str += header + ','
      }
    }
    str = str.substr(0, str.length - 1) + '\r\n'
    for (let i = 0; i < this.data.length; i++) {
      for (let fld = 0; fld < fields.length; fld++) {
        let fieldData = ''
        if (fields[fld].format) {
          fieldData = fields[fld].format(this.data[i], fields[fld].colval) + ''
        } else {
          fieldData = this.resolveObjPath(this.data[i], fields[fld].name) + ''
        }
        str += fieldData.replace(/\r?\n|\r|,/g, '') + ','
      }
      str = str.substr(0, str.length - 1) + '\r\n'
    }
    const blob = new Blob([str], { type: 'text/csv' })
    const url  = window.URL.createObjectURL(blob)
    window.open(url)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

}
