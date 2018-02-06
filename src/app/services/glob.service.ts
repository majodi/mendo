import { Injectable } from '@angular/core'

@Injectable()
export class GlobService {
    userLevel = {
        admin: 100,
        tenant: 50,
        superUser: 25,
        user: 0
    }
    tenantId: string

  constructor() {}
  
}
