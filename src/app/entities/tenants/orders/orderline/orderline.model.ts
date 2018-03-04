import { EntityMeta } from '../../../../models/entity-meta.model';

export interface OrderLine {
    id: string;
    meta: EntityMeta;
    order: string; // order
    article: string; // article
    size: string; // choice
    color: string; // choice
    number: number;
    amount: number;
}
