import { EntityMeta } from '../../../../models/entity-meta.model';

export interface OrderLine {
    id: string;
    meta: EntityMeta;
    order: string; // order
    article: string; // article
    maat: string; // choice
    kleur: string; // choice
    number: number;
    amount: number;
}
