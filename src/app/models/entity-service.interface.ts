import { FieldConfig } from '../shared/dynamic-form/models/field-config.interface'
import { ColumnDefenition } from '../shared/custom-components/models/column-defenition.model'

export interface EntityService {
    entityName: string
    entityPath: string
    basePath: string
    formConfig: FieldConfig[]
    colDef: ColumnDefenition[]
    initEntity$: Function
  }

