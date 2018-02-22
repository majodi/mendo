export const defaultTableTemplate = `
<app-table
  [title]="title"
  [titleIcon]="titleIcon"
  [isLoading]="isLoading"
  [selectMode]="selectMode"
  [selectionButton]="selectionButton"
  [selectionActive]="selectionActive"
  [data]="data"
  [columnDefs]="colDef"
  (clicked)="clicked($event)"
></app-table>  
`
