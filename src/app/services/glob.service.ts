import { Injectable } from '@angular/core'

@Injectable()
export class GlobService {
    userLevel = {
        admin: 100,
        tenant: 50,
        superUser: 25,
        user: 0
    }
    tenantId = 'l9XCh71vsxXg3M3nJ7aw' // temp test
    entityBasePath = `tenants/${this.tenantId}`
    actionMessage = {0:'Selectie', 1:'Toevoegen', 2:'Wijzigen', 3:'Verwijderen'}

  constructor() {}
  
}
