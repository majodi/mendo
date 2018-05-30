export interface SelectionField {
  name: string;
  disabled?: boolean;
  minimumLevel?: number;
  valueIsPk?: boolean;
  foreignkeyObject?: string;
}
