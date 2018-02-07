import { EntityMeta } from '../models/entity-meta.model';

export interface User {
    uid: string;
    meta: EntityMeta;
    email: string;
    photoURL?: string;
    verified?: boolean;
    displayName?: string;
    phoneNumber?: string;
    providerId?: string;
    isAnonymous?: boolean;
    level: number;
    fcmTokens?: { [token: string]: true };
    tenant?: string; // tenant
}