import { EntityMeta } from "./entity-meta.model";
import { Address } from "./address.model";

export interface Tenant {
    id: string;
    meta: EntityMeta;
    address: Address;
    banner?: string; // asset
    logo?: string; // asset
}