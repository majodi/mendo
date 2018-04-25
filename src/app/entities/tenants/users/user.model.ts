import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';
import { forceUppercase } from '../../../shared/dynamic-form/models/form-functions';
import { User } from '../../../models/user.model';

export const defaultTitle = 'Gebruikers'
export const defaultTitleIcon = 'verified_user'
export const defaultColDef = [
    {name: 'uid',           header: 'ID', sort: true},
    {name: 'displayName',   header: 'Naam', sort: true},
    {name: 'email',         header: 'Email', sort: true},
  ]
export const defaultFormConfig = []
