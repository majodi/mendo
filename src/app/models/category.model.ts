import { EntityMeta } from './system/entity-meta.model';

export interface Category {
    id: string;
    meta: EntityMeta;
    code: string;
    description: string;
}
