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

//   export interface User {
//     uid: string;
//     meta: EntityMeta;
//     email: string;
//     photoURL?: string;
//     verified?: boolean;
//     displayName?: string;
//     phoneNumber?: string;
//     providerId?: string;
//     isAnonymous?: boolean;
//     providerLogin?: boolean;
//     level: number;
//     fcmTokens?: { [token: string]: true };
//     tenant?: string; // tenant
//     organisation?: string; // organisation
//     employee?: string; // employee
//     pushSubscriptions?: PushSubscription[];
// }