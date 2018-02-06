import { EntityMeta } from '../../models/entity-meta.model';

export interface Property {
    id: string;
    meta: EntityMeta;
    code: string;
    choices: string;
    placeholder: string;
}
