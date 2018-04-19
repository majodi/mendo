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
import { Organisation } from '../organisations/organisation.model';
import { Category } from '../categories/category.model';
import { Article } from '../articles/article.model';

interface CategoryItem {
  id: string,
  title: string,
  image: string,
  children: CategoryItem[]
}

@Component({
  selector: 'app-store',
  template: `
  <div style="width:100%">
  <app-grid
    [singleRow]="true"
    [title]="categoriesTitle"
    [data]="categoryData"
    [highlightSelected]="true"
    [backButton]="categoriesBackButton"
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
  categoriesTitle = 'Categorieën'
  categoriesBackButton = false
  articleData: Tile[]
  allArticleData: Tile[]
  articleBaseQuery: QueryItem[]
  ngUnsubscribe = new Subject<string>()
  articleSelect = new BehaviorSubject<string|null>(null)
  actionIcon = ''
  currentOrder = ''
  lineCount = 0
  employeeBudged = 0
  employeeSpent = 0
  verified = false
  formConfig: FieldConfig[] = defaultFormConfig
  currentArticleId = ''
  articleChanged = false
  currentImageId = ''
  currentSizesId = ''
  currentColorsId = ''
  selectedCategory = ''
  categoryTree: CategoryItem[] = []
  embeds: Embed[] = [
    {type: 'onValueChg', code: (ctrl, value) => {
      const price_unit = this.formConfig[this.formConfig.findIndex(c => c.name == 'price_unit')].value
      const number = this.formConfig[this.formConfig.findIndex(c => c.name == 'number')].value
      if(price_unit && number){
        this.formConfig[this.formConfig.findIndex(c => c.name == 'amount')].value = (Number(price_unit) * Number(number)).toString()
      }
      if(ctrl == 'article'){
        const articleId = this.formConfig[this.formConfig.findIndex(c => c.name == 'article')].value
        if(articleId != this.currentArticleId) {this.articleChanged = true; this.currentArticleId = articleId}
        const imageId = this.formConfig[this.formConfig.findIndex(c => c.name == 'imageid')].value
        if(imageId && imageId != this.currentImageId){
          this.currentImageId = imageId
          const image = this.db.getUniqueValueId(`${this.gs.entityBasePath}/images`, 'id', imageId).subscribe((image: Image) => {
            return this.formConfig[this.formConfig.findIndex(c => c.name == 'imagedisplay')].value = image['name']
          })
        }
        const sizesId = this.formConfig[this.formConfig.findIndex(c => c.name == 'sizes')].value
        if(this.articleChanged || (sizesId && sizesId != this.currentSizesId)) {
          this.currentSizesId = sizesId
          const sizes = this.db.getUniqueValueId(`${this.gs.entityBasePath}/properties`, 'id', sizesId).subscribe((property: Property) => {
            if(property){
              const defaultSizesChoices = property['choices'].split(',')
              const overruleSizes = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleSizes')].value
              if(overruleSizes){
                const overruleSizesChoices = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleSizesChoices')].value
                let overruleSizesChoicesArray: Array<string> = []
                for (var key in overruleSizesChoices){
                  if(defaultSizesChoices.includes(key)){overruleSizesChoicesArray.push(key)}
                }                  
                return this.formConfig[this.formConfig.findIndex(c => c.name == 'size')].options = overruleSizesChoicesArray
              }
              return this.formConfig[this.formConfig.findIndex(c => c.name == 'size')].options = defaultSizesChoices  
            }
          })
        }
        const colorsId = this.formConfig[this.formConfig.findIndex(c => c.name == 'colors')].value
        if(this.articleChanged || (colorsId && colorsId != this.currentColorsId)){
          this.currentColorsId = colorsId
          const colors = this.db.getUniqueValueId(`${this.gs.entityBasePath}/properties`, 'id', colorsId).subscribe((property: Property) => {
            if(property){
              const defaultColorsChoices = property['choices'].split(',')
              const overruleColors = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleColors')].value
              if(overruleColors){
                const overruleColorsChoices = this.formConfig[this.formConfig.findIndex(c => c.name == 'overruleColorsChoices')].value
                let overruleColorsChoicesArray: Array<string> = []
                for (var key in overruleColorsChoices){
                  if(defaultColorsChoices.includes(key)){overruleColorsChoicesArray.push(key)}
                }                  
                return this.formConfig[this.formConfig.findIndex(c => c.name == 'color')].options = overruleColorsChoicesArray
              }
              return this.formConfig[this.formConfig.findIndex(c => c.name == 'color')].options = defaultColorsChoices  
            }
          })
        }
        this.articleChanged = false
      }
    }},
    {type: 'beforeSave', code: (action, o) => {
      if(action == 1){
        o['order'] = this.currentOrder
        o['amount'] = o['number'] * o['price_unit'] //last update for if user pressed enter
        for (var key in o){
          if(o[key] == undefined) {
            o[key] = null
          }
        }
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
    this.formConfig = defaultFormConfig.map(x => Object.assign({}, x));
    if(this.as.user.organisation != undefined){
      this.db.getDoc(`${this.gs.entityBasePath}/organisations/${this.as.user.organisation}`).then((o: Organisation) => {
        if(!o.packageSelection){
          this.articleBaseQuery = []
        } else {
          this.articleBaseQuery = [{fld: 'packageSelection.'+this.as.user.organisation, operator: '==', value: true}]
        }
        this.initDataSubscribers()
      }).catch(e => {
        console.log('could not get organisation of user: ', this.as.user.uid)
        this.articleBaseQuery = []
        this.initDataSubscribers()
      })
    } else {
      console.log('no organisation for user: ', this.as.user.uid)
      this.articleBaseQuery = []
      this.initDataSubscribers()    
    }
  }

  initDataSubscribers() {
    this.CategorySrv.colDef = [{name: 'image_v'}]
    this.CategorySrv.formConfig = [{type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},]
    this.CategorySrv.initEntity$().takeUntil(this.ngUnsubscribe).subscribe((categories: Category[]) => {

      this.categoryTree = []

      categories
      .filter((cat: Category) => !cat.parentCategory) //top-level
      .forEach((cat: Category) => {this.categoryTree
        .push({id: cat.id, title: cat.description, image: cat['image_v'], children: []})})

      categories
      .filter((cat: Category) => cat.parentCategory) //sub-level
      .forEach((child: Category) => this.categoryTree
        .find((cat: CategoryItem) => cat.id == child.parentCategory).children
        .push({id: child.id, title: child.description, image: child['image_v'], children: []}))

      this.ArticleSrv.colDef = [
        {name: 'image_v'},
      ]
      this.ArticleSrv.formConfig = [
        {type: 'lookup', name: 'image', customLookupFld: {path: 'images', tbl: 'image', fld: 'name'}},
      ]
      this.articleSelect.switchMap(id => {
        const articleQuery = this.articleBaseQuery.map(x => Object.assign({}, x))
        if(id){
          articleQuery.push({fld: 'category', operator: '==', value: id})
        }
        return this.ArticleSrv.initEntity$(articleQuery)
      }).takeUntil(this.ngUnsubscribe)
      .subscribe((articles: Article[]) => {
        const categoriesWithArticles = []
        this.articleData = articles.map((article: Article) => {
          if(!categoriesWithArticles.includes(article.category)){categoriesWithArticles.push(article.category)}
          return {
            id: article.id,
            title: article.description_s,
            description: article.description_l,
            image: article['image_v'],
            price: this.as.user.organisation && article.priceOverrule && article.priceOverrule[this.as.user.organisation] ? article.priceOverrule[this.as.user.organisation] : article.price,
            optionField: article.category
          }  
        })
        this.allArticleData = this.articleData.map(x => Object.assign({}, x))
        if(!this.categoriesBackButton){
          this.categoryData = this.categoryTree.map((cat: CategoryItem) => { //top-level
            return {
              id: cat.id,
              title: cat.title,
              image: cat.image,
              optionField: cat.children
            }
          })  
        }
        this.categoryData = this.categoryData.filter(cat => {
          if(categoriesWithArticles.includes(cat.id)) return true;
          const children: CategoryItem[] = cat.optionField
          if(children == undefined || children.length == 0) return false;
          return children.some(child => {return categoriesWithArticles.includes(child.id)})
        })
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

  onClickCategory(tile: Tile) {
    if(tile.id == 'back'){
      this.categoriesBackButton = false
      this.categoriesTitle = 'Categorieën'
      this.articleSelect.next(null)
      return
    }
    this.selectedCategory = tile.id
    this.db.getDoc(`${this.CategorySrv.entityPath}/${tile.id}`)
    .then((category: Category) => {
      if(category.parentCategory == undefined || !category.parentCategory){ // top level
        let categoryIds
        const children = this.categoryTree.find((mainCategory: CategoryItem) => mainCategory.id == tile.id).children
        if(children != undefined && children.length > 0){
          this.categoryData = children          
          this.categoriesBackButton = true
          this.categoriesTitle = 'Categorieën - ' + tile.title
          categoryIds = this.categoryData.map((tile: Tile) => tile.id)
        } else {
          categoryIds = [tile.id]
        }
        this.articleData = this.allArticleData.filter((tile: Tile) => {return categoryIds.includes(tile.optionField)})
      } else { //sub-level
        this.articleSelect.next(tile.id)
      }
    })
    .catch(e => console.log('could not find category clicked on'))
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
