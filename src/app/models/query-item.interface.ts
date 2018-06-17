export interface QueryItem {
    fld: string
    operator: string
    value: string | boolean | number | {}
    valueIsPk?: boolean
    foreignkeyObject?: string
}

