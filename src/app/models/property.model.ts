import { EntityMeta } from './system/entity-meta.model';

export interface Property {
    id: string;
    meta: EntityMeta;
    code: string;
    description: string;
    properties: string;
}
