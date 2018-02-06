import { EntityMeta } from '../../../models/entity-meta.model';

export interface OrderLine {
    id: string;
    meta: EntityMeta;
    order: string; // order
    article: string; // article
    maat: string; // property choice
    kleur: string; // property choice
    number: number;
    amount: number;
}
