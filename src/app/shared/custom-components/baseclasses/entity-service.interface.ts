import { FieldConfig } from '../../dynamic-form/models/field-config.interface';
import { ColumnDefenition } from '../models/column-defenition.model';

export interface EntityService {
    entityName: string;
    entityPath: string;
    basePath: string
    formConfig: FieldConfig[];
    colDef: ColumnDefenition[]
    initEntity$: Function;
  }
  