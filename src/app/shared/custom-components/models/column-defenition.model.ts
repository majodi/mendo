export interface ColumnDefenition {
    name: string;
    header?: string;
    hideXs?: boolean;
    sort?: boolean;
    filter?: boolean;
    icon?: string;
    iconSelect?: Function;
    imageSelect?: Function;
    flex?: string;
    format?: Function;
}