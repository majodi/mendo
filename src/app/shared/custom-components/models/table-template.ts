export const defaultTableTemplate = `
<app-table
  [title]="title"
  [titleIcon]="titleIcon"
  [isLoading]="isLoading"
  [selectMode]="selectMode"
  [soberMode]="soberMode"
  [selectionButton]="selectionButton"
  [selectionActive]="selectionActive"
  [itemSelect]="itemSelect"
  [itemSelectEntity]="itemSelectEntity"
  [itemSelectParent]="itemSelectParent"
  [insertButton]="insertButton"
  [data]="data"
  [columnDefs]="colDef"
  (clicked)="clicked($event)"
></app-table>  
`
