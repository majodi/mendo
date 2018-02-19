import { FieldConfig } from '../../dynamic-form/models/field-config.interface';

export interface EntityService {
    entityPath: string;
    basePath: string
    formConfig: FieldConfig[];
    initEntity$: Function;
  }
  