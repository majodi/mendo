import { EntityMeta } from './system/entity-meta.model';

export interface Article {
    id: string;
    meta: EntityMeta;
    code: string;
    description_s: string;
    description_l: string;
    category: string; // category
    image: string; // asset
    measurements: string; // property
    colors: string; // property
    price: number;
    unit: string;
}
