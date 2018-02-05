import { EntityMeta } from "./entity-meta.model";

export interface Asset {
    id: string;
    meta: EntityMeta;
    name: string;
    url: string;
    thumbUrl: string;
    tagList: {};
}