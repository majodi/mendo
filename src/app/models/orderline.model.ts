import { EntityMeta } from './system/entity-meta.model';

export interface Order {
    id: string;
    meta: EntityMeta;
    order: string; // order
    article: string; // article
    maat: string;
    kleur: string;
    number: number;
    amount: number;
}
