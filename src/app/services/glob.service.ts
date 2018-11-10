import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { QueryItem } from '../models/query-item.interface'
import { User } from '../models/user.model'
import { Subject, BehaviorSubject } from 'rxjs'

@Injectable()
export class GlobService {
    userLevel = [{level: 0, userLevel: 'user'}, {level: 100, userLevel: 'super'}, {level: 50, userLevel: 'tenant'}, {level: 25, userLevel: 'organisation'}]
    mendo = 'l9XCh71vsxXg3M3nJ7aw'
    tenantId = 'l9XCh71vsxXg3M3nJ7aw' // default Mendo
    tenantName = 'Mendo'
    entityBasePath = `tenants/${this.tenantId}`
    storageBasePath = 'https://storage.cloud.google.com/mendo-app.appspot.com/'
    entityId = {}
    actionMessage = {0: 'Selectie', 1: 'Toevoegen', 2: 'Wijzigen', 3: 'Verwijderen', 10: 'Formulier'}
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    NavQueries: QueryItem[] = []
    NavQueriesRead = false
    backButton = false

    activeOrder: string
    activeUser: User

    orderAs: User

    homePageSelected = 'Home'
    pageChanged$ = new BehaviorSubject('Home') // Signal homepage selected

  constructor(private router: Router) {}

  navigateWithQuery(link, fld, operator, value) {
    if (!this.backButton) { // currently can not take nested navQueries
      this.NavQueries.push({fld: fld, operator: operator, value: value})
      this.NavQueriesRead = false
      this.backButton = true
      return this.router.navigate([link])
    }
}

}
