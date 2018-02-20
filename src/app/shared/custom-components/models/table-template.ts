export const defaultTableTemplate = `
<app-table
  [title]="title"
  [titleIcon]="titleIcon"
  [isLoading]="isLoading"
  [selectionButton]="selectionButton"
  [data]="data"
  [columnDefs]="colDef"
  (clicked)="clicked($event)"
></app-table>  
`
