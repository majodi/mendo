export interface headerSelectItem {
    value: string;
    viewValue: string;
}

export interface ColumnDefenition {
    name: string;
    header?: string;
    hideXs?: boolean;
    sort?: boolean;
    filter?: boolean;
    icon?: string;
    iconSelect?: Function;
    iconColorSelect?: Function;
    imageSelect?: Function;
    headerSelect?: headerSelectItem[];
    headerSelectValue?: string;
    imageIdField?: string;
    flex?: string;
    format?: Function;
}