import { Validators } from '@angular/forms'
import { EntityMeta } from '../../../models/entity-meta.model'
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions'
import { User } from '../../../models/user.model'

export const defaultTitle = 'Gebruikers'
export const defaultTitleIcon = 'verified_user'
export const defaultColDef = [
    {name: 'uid',             header: '.', flex: '15', sort: true},
    {name: 'displayName',     header: 'Naam', sort: true},
    {name: 'email',           header: 'Email', sort: true},
    {name: 'employee_v',      header: 'Medewerker', hideXs: true},
    {name: 'organisation_v',  header: 'Organisatie', hideXs: true},
    {name: 'initialPW',       header: 'Initieel WW', hideXs: true},
    {name: 'level',           header: 'Level', iconSelect: rec => {
      let levelIcon = rec['level']
      if (levelIcon === 0 && rec['employee'] !== undefined) {levelIcon = 1}
      return {0: 'account_circle', 1: 'verified_user', 25: 'supervisor_account', 50: 'star_border', 100: 'stars'}[levelIcon]}, flex: '15'
    },
  ]
