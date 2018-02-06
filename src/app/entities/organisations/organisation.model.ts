import { EntityMeta } from '../../models/entity-meta.model';
import { Address } from '../../models/address.model';

export interface Organisation {
    id: string;
    meta: EntityMeta;
    address: Address;
    logo?: string; // asset
}
