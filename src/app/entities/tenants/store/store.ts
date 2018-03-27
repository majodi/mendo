import { Component, OnInit, OnDestroy } from '@angular/core';

import { Tile } from '../../../shared/custom-components/models/tile.model';
import { CategoryService } from '../categories/category.service';
import { ArticleService } from '../articles/article.service';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { QueryItem } from '../../../models/query-item.interface';
import { DbService } from '../../../services/db.service';
import { GlobService } from '../../../services/glob.service';
import { PopupService } from '../../../services/popup.service';
import { defaultFormConfig } from '../orderlines/orderline.model';
import { CrudService } from '../../../services/crud.service';
import { Embed } from '../../../shared/dynamic-form/models/embed.interface';
import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';
import { Image } from '../images/image.model';
import { Property } from '../properties/property.model';
import { CartComponent } from './cart';
import { AuthService } from '../../../services/auth.service';
import { Employee } from '../organisations/employees/employee.model';

@Component({
  selector: 'app-store',
  template: `
  <div style="width:100%">
  <app-grid
    [singleRow]="true"
    [title]="'Categorieën'"
    [data]="categoryData"
    (clicked)="onClickCategory($event)"
  ></app-grid>
  <hr>
  <app-grid
    [singleRow]="false"
    [title]="'Artikelen'"
    [buttonIcon]="'shopping_cart'"
    [buttonText]="'Bestel'"
    [data]="articleData"
    [showFilter]="true"
    [actionButtonIcon]="actionIcon"
    [actionButtonInfo]="lineCount"
    (actionButtonClicked)="orderFulfilment($event)"
    (clicked)="onClickArticle('tile', $event)"
    (buttonClicked)="onClickArticle('button', $event)"
  ></app-grid>
  </div>
  `,
  styles: [``]
})
export class StoreComponent implements OnInit, OnDestroy {
  categoryData: Tile[]
  articleData: Tile[]
  ngUnsubscribe = new Subject<string>()
  articleSelect = new BehaviorSubject<string|null>(null)
  actionIcon = ''
  currentOrder = ''
  lineCount = 0
  employeeBudged = 0
  employeeSpent = 0
  verified = false
  formConfig: FieldConfig[] = defaultFormConfig
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value) => {
      const price_unit = this.formConfig[this.formConfig.findIndex(c => c.name == 'price_unit')].value
      const number = this.formConfig[this.formConfig.findIndex(c => c.name == 'number')].value
      if(price_unit && number){
        this.formConfig[this.formConfig.findIndex(c => c.name == 'amount')].value = (Number(price_unit) * Number(number)).toString()
      }
      const imageId = this.formConfig[this.formConfig.findIndex(c => c.name == 'imageid')].value
      if(imageId){
        const image = this.db.getUniqueValueId(`${this.gs.entityBasePath}/images`, 'id', imageId).subscribe((image: Image) => {
          return this.formConfig[this.formConfig.findIndex(c => c.name == 'imagedisplay')].value = image['name']
        })
      }
      const sizesId = this.formConfig[this.formConfig.findIndex(c => c.name == 'sizes')].value
      if(sizesId){
        const sizes = this.db.getUniqueValueId(`${this.gs.entityBasePath}/properties`, 'id', sizesId).subscribe((property: Property) => {
          return this.formConfig[this.formConfig.findIndex(c => c.name == 'size')].options = property['choices'].split(',')
        })
      }
      const colorsId = this.formConfig[this.formConfig.findIndex(c => c.name == 'colors')].value
      if(colorsId){
        const colors = this.db.getUniqueValueId(`${this.gs.entityBasePath}/properties`, 'id', colorsId).subscribe((property: Property) => {
          return this.formConfig[this.formConfig.findIndex(c => c.name == 'color')].options = property['choices'].split(',')
        })
      }
    }},
    {type: 'beforeSave', code: (action, o) => {
      if(action == 1){
        o['order'] = this.currentOrder
        o['amount'] = o['number'] * o['price_unit'] //last update for if user pressed enter
        return Promise.resolve()
      } else return Promise.resolve()  
    }}    
  ]

  constructor(
    private CategorySrv: CategoryService,
    private ArticleSrv: ArticleService,
    private db: DbService,
    private gs: GlobService,
    private ps: PopupService,
    private cs: CrudService,
    private as: AuthService,
  ) {
    this.CategorySrv.colDef = [{name: 'image_v'}]
    this.CategorySrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.CategorySrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe(categories => {
      this.categoryData = categories.map(category => {
        return {
          id: category.id,
          title: category.description,
          image: category.image_v
        }  
      })
    })
    this.ArticleSrv.colDef = [{name: 'image_v'}]
    this.ArticleSrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.articleSelect.switchMap(id => {
      if(id){
        return this.ArticleSrv.initEntity$([{fld: 'category', operator: '==', value: id}])
      } else {
        return this.ArticleSrv.initEntity$()
      }
    }).takeUntil(this.ngUnsubscribe)
    .subscribe(articles => {
      this.articleData = articles.map(article => {
        return {
          id: article.id,
          title: article.description_s,
          description: article.description_l,
          image: article.image_v,
          price: article.price
        }  
      })
    })
  }

  ngOnInit() {
    this.db.getDoc(`${this.gs.entityBasePath}/employees/${this.as.user.employee}`)
    .then((employee: Employee) => {
      this.verified = true
      this.employeeBudged = employee.budget
      this.employeeSpent = employee.spent
      this.refreshCart()
    })
    .catch(e => this.verified = false)
  }

  refreshCart() {
    this.db.getFirst(`${this.gs.entityBasePath}/orders`, [
      {fld:'status', operator:'==', value:'new'},
      {fld:'employee', operator:'==', value: this.as.user.employee}
    ]).subscribe(o => {
      if(o['number']){
        this.currentOrder = o['id']
        this.refreshCartCount()
      } else {
        this.db.getIncrementedCounter('orderNumber').then(number => {
          this.db.addDoc({number: number, date: new Date(), employee: this.as.user.employee, organisation: this.as.user.organisation, status: 'new'}, `${this.gs.entityBasePath}/orders`).then(ref => {
            this.currentOrder = ref.id
            this.refreshCartCount()
          })
        })  
      }
    })
  }

  refreshCartCount() {
    this.actionIcon = 'shopping_cart'
    this.db.getCount(`${this.gs.entityBasePath}/orderlines`, [{fld: 'order', operator: '==', value: this.currentOrder}]).subscribe(count => {
      this.lineCount = count
    })
  }

  onClickCategory(e) {
    this.articleSelect.next(e.id)
  }

  onClickArticle(clickedOn, e) {
    if(clickedOn == 'tile'){
      if(!this.verified){this.ps.buttonDialog('Account niet geverifieerd, bestelling plaatsen niet mogelijk', 'OK'); return}
      this.ps.buttonDialog(`${e['title']}\r\nToevoegen aan bestelling?`, 'OK', 'Annuleer').then(v => {
        if(v == 1){
          const articleFld = this.formConfig.find(c => c.name == 'article')
          articleFld['doNotPopulate'] = true
          articleFld['value'] = e['id']
          const description_s = this.formConfig.find(c => c.name == 'description_s')
          description_s['doNotPopulate'] = false
          const description_l = this.formConfig.find(c => c.name == 'description_l')
          description_l['doNotPopulate'] = false
          this.cs.insertDialog(this.formConfig, {order: this.currentOrder, article: e['id']}, `${this.gs.entityBasePath}/orderlines`, this['embeds'] ? this['embeds'] : undefined).then(id => {this.refreshCart()}).catch(err => {console.log(err)})
        }
      })
    }
  }
  
  orderFulfilment(e) {
    this.ps.BrowseDialog(CartComponent, false, true, [{fld: 'order', operator: '==', value: this.currentOrder}]).then(v => this.refreshCart())
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()    
  }

}
