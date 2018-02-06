import { EntityMeta } from './system/entity-meta.model';
import { Address } from './system/address.model';

export interface Organisation {
    id: string;
    meta: EntityMeta;
    address: Address;
    logo?: string; // asset
}
