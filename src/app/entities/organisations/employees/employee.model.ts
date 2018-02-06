import { EntityMeta } from '../../../models/entity-meta.model';
import { Address } from '../../../models/address.model';

export interface Employee {
    id: string;
    meta: EntityMeta;
    address: Address;
}
