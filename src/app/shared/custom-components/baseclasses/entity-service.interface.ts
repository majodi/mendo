import { FieldConfig } from '../../dynamic-form/models/field-config.interface';

export interface EntityService {
    entityName: string;
    entityPath: string;
    basePath: string
    formConfig: FieldConfig[];
    initEntity$: Function;
  }
  