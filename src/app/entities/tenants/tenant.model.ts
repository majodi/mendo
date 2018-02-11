import { EntityMeta } from "../../models/entity-meta.model";
import { Address } from "../../models/address.model";

export interface Tenant {
    id: string;
    meta: EntityMeta;
    address: Address;
    banner?: string; // asset
    logo?: string; // asset
    order_count: number
}

export const tenantsTitle = 'Tenants'
export const tenantsTitleIcon = 'store'
