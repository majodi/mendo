import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { GlobService } from '../../../services/glob.service';

@Component({
  selector: 'app-filepick',
  styles: [`
  .custom-file-upload {color: rgba(0,0,0,1); background-color: rgba(255,255,255,0); cursor: pointer;},
  input[type="file"] {display: none;},
    `],
  template: `
<div fxLayout="column" fxLayoutAlign="start start" style="width:100%">
<div *ngIf="!value" fxLayout="row" fxLayoutAlign="start start" style="width:100%">
  <mat-form-field fxFlex="30" fxFlexAlign="center">
    <input matInput [formControl]="fileCtrl" placeholder="{{placeholder}}" [disabled]=isDisabled readonly>
    <mat-hint *ngIf="error" align="end" style="color:red">{{error}}</mat-hint>
  </mat-form-field>
  <label class="custom-file-upload" fxFlexAlign="center" [fxFlexOffset]="5">
    <input name="file" #file_input type="file" (change)="selectFile($event)" style="display:none"/>
      <mat-icon>search</mat-icon>
  </label>
</div>
<ng-container *ngIf="fileIsImg; then img_tpl else file_tpl"></ng-container>
<ng-template #img_tpl><img #preview src="{{value}}" width="250"></ng-template>
<ng-template #file_tpl><mat-icon *ngIf="value" style="font-size: 40px;">insert_drive_file</mat-icon><br>{{fileName}}</ng-template>
<br><br>
</div>
  `
})
export class FilepickComponent implements OnInit, OnChanges {
  @Input() value: string
  @Input() placeholder: string
  @Output() picked = new EventEmitter();
  @Input() isDisabled = false;
  @ViewChild('preview') private previewRef: ElementRef
  fileCtrl: FormControl
  error: string
  reader = new FileReader()
  fileIsImg = false
  fileName = ''

  constructor(
    private gs: GlobService,
  ) {
    this.fileCtrl = new FormControl();
  }

  ngOnInit() {
    this.isDisabled = true
  }

  isImg(name: string) {
    this.fileName = name
    if(name.toUpperCase().startsWith('HTTPS://')){
      this.fileName = this.getFilePath(name)
    }
    const parts = this.fileName ? this.fileName.split('.') : ['']
    const ext = parts.length > 1 ? parts[parts.length-1].toUpperCase() : ''
    const imgExt = ['JPG', 'JPEG', 'PNG', 'GIF', 'SVG']
    return imgExt.includes(ext)
  }

  getFilePath(url, root?) {
    if(root == undefined) {root = `${this.gs.entityBasePath}/`}
    const fullPath = decodeURIComponent(url).split('?')[0]
    const pathFromRoot = fullPath.slice(fullPath.indexOf(root))
    const parts = pathFromRoot ? pathFromRoot.split('/') : ['']
    const bareFileName = parts.length > 1 ? parts[parts.length-1] : ''
    return bareFileName
  }

  selectFile(e) {
    let file: File = e.target.files.item(0)
    if(file){
      this.error = ''
      if(file.size > 999000){
        this.error = 'Filesize too big, please compress/resize'
        return
      }
      this.fileCtrl.setValue(file.name)
      this.picked.emit(file)
      if(this.isImg(file.name)){
        this.reader.onload = (r) => {
          this.previewRef.nativeElement.src = r.target['result']
        };
        this.reader.readAsDataURL(file)        
      }
    }
  }

  ngOnChanges() {
    this.fileIsImg = this.isImg(this.value)
  }

}
