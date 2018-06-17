
import {distinctUntilChanged, debounceTime, takeUntil} from 'rxjs/operators'
import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { trigger, transition, style, animate } from '@angular/animations'

import { Observable, Subject } from 'rxjs'

import { Tile } from '../models/tile.model'
import { ObservableMedia } from '@angular/flex-layout'

@Component({
  selector: 'app-grid',
  animations: [trigger('pageAnim', [transition(':enter', [style({transform: 'translateY(-100%)'}), animate(250)])])],
styles: [`
.container-title-text {margin-top:16px; margin-bottom:16px; font-size: calc(24px + 0.25vw)}
.container-title-icon {font-size: 40px; max-width: 40px; width: auto; margin-right: 15px}
.outer {white-space: nowrap; overflow-x:scroll; background-color: aliceblue}
.inner {margin: 0.5% 0.5% 0.5%; display: inline-block;}
.item-title {font-size: calc(16px + 0.25vw); line-height: calc(22px + 0.25vw); margin-bottom: 0}
.bulletin-title {font-size: calc(16px + 1vw); line-height: calc(22px + 1vw); margin-bottom: 0; margin-top:22px}
.badge {margin: 0px; padding: 2px 6px 0px; border: 1px solid black; color: white; border-radius: 20px 20px; background: red; width: 10px; height: 20px;}
.left {position: relative; top: -150px;}
.right {position: relative; top: -150px; float: right;}
`],
template: `
<div [@pageAnim] style="padding: 0px 5px; width:100%">
  <div fxLayout="row" fxLayoutAlign="start center" style="margin: 0 0.5% 1%">
    <mat-icon *ngIf="titleIcon" class="container-title-icon">{{titleIcon}}</mat-icon>
    <p class="mat-display-1 container-title-text">{{title}}</p>
    <button *ngIf="backButton" mat-raised-button color="warn" style="margin-left: 15px" (click)="onClick('back')"><mat-icon>fast_rewind</mat-icon>Terug</button>
    <mat-form-field *ngIf="showFilter" fxFlex="40" style="margin-left:2vw">
      <input matInput (keyup)="filterKeyUp.next($event.target.value)" placeholder="Filter">
    </mat-form-field>
    <div *ngIf="actionButtonIcon" fxLayout="row" fxLayoutAlign="start center" (click)="onActionButtonClick('action')" style="margin-left: 2vw">
      <button mat-fab color="primary"><mat-icon>{{actionButtonIcon}}</mat-icon></button>
      <p fxFlexAlign="start" class="badge">{{actionButtonInfo}}</p>
    </div>
  </div>
  <div #scrollarea [ngClass]="{'outer': singleRow}">
    <div *ngFor="let tile of tiles" class="inner" [ngStyle]="getItemStyle(tile)">
      <div fxLayout="column" fxLayoutAlign="start center" (click)="onClick(tile)">
        <div *ngIf="tile.image">
          <img src="{{tile.image}}" onerror="this.onerror=null;this.src='assets/image.svg'" [ngStyle]="getImageStyle()">
        </div>
        <div *ngIf="!bulletinStyle" style="white-space:normal">
          <p class="mat-headline item-title"><b>{{tile.title}}</b></p>
        </div>
        <div *ngIf="bulletinStyle" style="white-space:normal">
          <p class="mat-headline bulletin-title"><b>{{tile.title}}</b></p>
        </div>
        <div>
          <p *ngIf="!bulletinStyle" class="mat-body-2" style="line-height:18px; margin:0; white-space:pre-wrap; max-width:1024px">{{tile.description}}</p>
          <p *ngIf="tile.price" class="mat-body-2" style="line-height:18px; margin:0; color:red">{{tile.price}} {{tile.currency}}</p>
        </div>
        <div>
          <p *ngIf="bulletinStyle" class="mat-subheading-2" style="line-height:18px; margin:0; white-space:pre-wrap; max-width:1024px">{{tile.description}}</p>
          <p *ngIf="tile.price" class="mat-body-2" style="line-height:18px; margin:0; color:red">{{tile.price}} {{tile.currency}}</p>
        </div>
        <div *ngIf="!bulletinStyle && (buttonText || tile.buttonText)" fxFlex="20" fxFlexAlign="start">
          <button mat-button color="primary" (click)="onButtonClick(tile, $event)"><mat-icon>{{buttonIcon}}</mat-icon>{{tile.buttonText ? tile.buttonText : buttonText}}</button>
          <br/><br/>
        </div>
        <div *ngIf="bulletinStyle && (buttonText || tile.buttonText)">
          <button mat-button color="primary" (click)="onButtonClick(tile, $event)" style="font-size:30px; margin-top:30px">
            <mat-icon style="font-size:40px; margin-right:20px; padding-bottom:16px">{{buttonIcon}}</mat-icon>{{tile.buttonText ? tile.buttonText : buttonText}}
          </button>
          <br/><br/>
        </div>
      </div>
      <div *ngIf="divider">
        <hr>
        <br>
      </div>
    </div>
  </div>
  <button *ngIf="singleRow && !mediaIsXs" mat-fab color="primary" class="left" (click)="scrollLeft()"><mat-icon>chevron_left</mat-icon></button>
  <button *ngIf="singleRow && !mediaIsXs" mat-fab color="primary" class="right" (click)="scrollRight()"><mat-icon>chevron_right</mat-icon></button>
</div>
`
})

export class GridComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('scrollarea') private scrollAreaRef: ElementRef
  mediaIsXs: boolean
  scrollWidth = 0
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
  @Input() highlightSelected: boolean
  @Input() backButton: boolean
  @Input() bulletinStyle: boolean
  @Output() clicked = new EventEmitter()
  @Output() buttonClicked = new EventEmitter()
  @Output() actionButtonClicked = new EventEmitter()
  tiles: Tile[]
  selected: Tile

  constructor(
    public media: ObservableMedia,
  ) {
    this.mediaIsXs = this.media.isActive('xs')
    media.asObservable().pipe(takeUntil(this.ngUnsubscribe)).subscribe((change) => {
      this.mediaIsXs = this.media.isActive('xs')
    })
  }

  ngOnInit() {
    this.scrollWidth = this.maxItemWidth !== undefined ? parseInt(this.maxItemWidth, 10) / 100 : 0.3
    this.filterKeyUp.pipe(
    takeUntil(this.ngUnsubscribe),
    debounceTime(400),
    distinctUntilChanged(), )
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
      Object.keys(item).filter(v => !['id', 'meta'].includes(v)).map(l1 => {
              if (typeof item[l1] === 'object' && item[l1] != null) {
                  Object.keys(item[l1]).map(l2 => flatDataStr += item[l1][l2] ? item[l1][l2] : '')
              } else {flatDataStr += item[l1] ? item[l1] : ''}
      })
      return flatDataStr.toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
    })
  }

  getItemStyle(tile) {
    return {
      'width': '100%',
      'max-width': this.maxItemWidth !== undefined ? this.maxItemWidth + '%' : '30%', // leave default at 30% for store module
      'border': this.highlightSelected && tile === this.selected ? '3px solid grey' : ''
    }
  }

  getImageStyle() {
    return {
      'max-width': '100%',
      'max-height': this.maxImageHeight !== undefined ? this.maxImageHeight + 'vw' : '20vw'
    }
  }

  onClick(tile) {
    if (tile === 'back') {
      this.clicked.emit({id: 'back'})
    } else {
      this.selected = tile
      this.clicked.emit(tile)
    }
  }

  onButtonClick(e, event?) {
    this.buttonClicked.emit(e)
    if (event !== undefined) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  onActionButtonClick(e) {
    this.actionButtonClicked.emit(e)
  }

  scrollRight() {
    this.scrollTo(this.scrollAreaRef.nativeElement, this.scrollAreaRef.nativeElement.scrollLeft + this.scrollAreaRef.nativeElement.clientWidth * this.scrollWidth)
  }

  scrollLeft() {
    this.scrollTo(this.scrollAreaRef.nativeElement, this.scrollAreaRef.nativeElement.scrollLeft - this.scrollAreaRef.nativeElement.clientWidth * this.scrollWidth)
  }

  scrollTo(element, to = 0, duration = 1000) {
    const start = element.scrollLeft
    const change = to - start
    const increment = 20
    let currentTime = 0

    const animateScroll = (() => {

      currentTime += increment

      const val = this.easeInOutQuad(currentTime, start, change, duration)

      element.scrollLeft = val

      if (currentTime < duration) {
        setTimeout(animateScroll, increment)
      }
    })

    animateScroll()
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) { return c / 2 * t * t + b }
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }

  setColumns() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

}
