import { EntityMeta } from '../../models/entity-meta.model';

export interface Order {
    id: string;
    meta: EntityMeta;
    number: string;
    employee: string; // employee
    date: Date;
    total: number;
    line_count: number;
}
