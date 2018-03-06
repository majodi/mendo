import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { UploadService } from '../../../../services/upload.service';
import { GlobService } from '../../../../services/glob.service';
import { DbService } from '../../../../services/db.service';

import { FieldConfig } from '../../models/field-config.interface';

@Component({
  exportAs: 'dynamicForm',
  selector: 'dynamic-form',
  styleUrls: ['dynamic-form.component.scss'],
  template: `
    <form
      class="dynamic-form"
      [formGroup]="form"
      (submit)="handleSubmit('save', $event)">
      <ng-container
        *ngFor="let field of toPopulate;"
        dynamicField
        [config]="field"
        [group]="form"
        [formAction]="formAction">
      </ng-container>
      <mat-hint *ngIf="info" align="end" style="color:red">{{info}}</mat-hint>
      <mat-progress-bar *ngIf="us.progress > 0" mode="determinate" [value]="us.progress"></mat-progress-bar>
      <div [ngSwitch]="deleteState">
        <mat-dialog-actions *ngSwitchCase="false">
          <button mat-button type="submit" color="primary" [disabled]="!form.valid || waitOnUpload">Bewaar</button>
          <button mat-button type="button" (click)="handleSubmit('cancel')" color="primary">Annuleer</button>
          <span class="spacer"></span>
          <button mat-icon-button (click)="deleteState=true" color="primary" [disabled]="formAction==1">
              <mat-icon aria-label="delete icon-button with a bin icon">delete</mat-icon>
          </button>
        </mat-dialog-actions>
        <mat-dialog-actions *ngSwitchCase="true">
          <button mat-button type="button" (click)="handleSubmit('delete')" color="warn">Verwijder</button>
          <button mat-button type="button" (click)="handleSubmit('cancel')" color="primary">Annuleer</button>
        </mat-dialog-actions>
      </div>        
    </form>
  `
})
export class DynamicFormComponent implements OnChanges, OnInit {
  @Input() config: FieldConfig[] = [];
  @Input() formAction: number = 0;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  toPopulate: FieldConfig[] = [];
  deleteState = false
  waitOnUpload = false
  info = ''

  // get controls() { return this.config.filter(({type}) => type !== 'button'); }
  get controls() { return this.config.filter(({type}) => !['button', 'imagedisplay', 'stringdisplay'].includes(type)); }
  get changes() { return this.form.valueChanges; }
  get valid() { return this.form.valid; }
  get value() { return this.form.value; }

  constructor(
    private fb: FormBuilder,
    private us: UploadService,
    private gs: GlobService,
    private db: DbService,
  ) {}

  ngOnInit() {
    this.info = ''
    if(this.formAction != 0){
      this.toPopulate = this.config.filter(({doNotPopulate}) => doNotPopulate == undefined || !doNotPopulate)
    } else {this.toPopulate = this.config}
    console.log('topopulate: ', this.toPopulate)
    this.form = this.createGroup();
  }

  ngOnChanges() {
    if(this.formAction != 0){
      this.toPopulate = this.config.filter(({doNotPopulate}) => doNotPopulate == undefined || !doNotPopulate)
    } else {this.toPopulate = this.config}
    console.log('topopulate (chg): ', this.toPopulate)
    if (this.form) {
      const controls = Object.keys(this.form.controls);
      const configControls = this.controls.map((item) => item.name);

      controls
        .filter((control) => !configControls.includes(control))
        .forEach((control) => this.form.removeControl(control));

      configControls
        .filter((control) => !controls.includes(control))
        .forEach((name) => {
          const config = this.config.find((control) => control.name === name);
          this.form.addControl(name, this.createControl(config));
        });

    }
  }

  createGroup() {
    const group = this.fb.group({});
    this.controls.forEach(control => group.addControl(control.name, this.createControl(control)));
    return group;
  }

  createControl(config: FieldConfig) {
    const { disabled, validation, value } = config;
    const newCtrl = this.fb.control({ disabled, value }, validation);
    if(!['button', 'input', 'select'].includes(config.type)){
      config.customValueChg = (name: string, value: any) => { //for custom components
        this.info = (this.formAction == 0 && config.type == 'chiplist' && Object.keys(value).length > 1) ? 'Tags: alleen eerste waarde wordt gebruikt!' : ''
        this.form.controls[name].setValue(config.type == 'lookup' ? value['id'] : value, {emitEvent: true})
        if(config.customUpdateWithLookup){
          if(this.form.controls[config.customUpdateWithLookup.fld]){ // display fields are excluded
            this.form.controls[config.customUpdateWithLookup.fld].setValue(this.objectValue(value, config.customUpdateWithLookup.lookupFld))
          }
          let configToUpdate = this.config.find((control) => control.name === config.customUpdateWithLookup.fld)
          if(configToUpdate){
            configToUpdate.value = configToUpdate.type == 'imagedisplay' ? this.us.getThumb(this.objectValue(value, config.customUpdateWithLookup.lookupFld)) : this.objectValue(value, config.customUpdateWithLookup.lookupFld)
          }
        }
        if((config.customValidator != undefined) && !config.customValidator(config.type == 'lookup' ? value['id'] : value)){
          console.log('ERR name: ', value)
          this.form.controls[name].setErrors({'invalid': true}, {emitEvent: true})
        }
      }
    }
    return newCtrl
  }

  handleSubmit(action: string, event?: Event) {
    if(event != undefined){
      event.preventDefault();
      event.stopPropagation();  
    }
    this.config.forEach(config => {
      if(['chiplist', 'lookup', 'pulldown'].includes(config.type)){
        this.value[config.name] = config.value
      }
      if(config.type == 'filepick' && this.formAction == 1){ //only on insert!!
        this.waitOnUpload = true
        this.us.pushUpload(config.customFile).subscribe(url => {
          this.waitOnUpload = false
          this.us.progress = 0
          this.value[config.name] = url
          this.submit.emit({response: action, value: this.value})
        })
      }
      if(config.type == 'input' && config.inputValueTransform != undefined){
        this.value[config.name] = config.inputValueTransform(config.value)
      }
    })
    if(!this.waitOnUpload){
      this.submit.emit({response: action, value: this.value});    
    }
  }

  setDisabled(name: string, disable: boolean) {
    if (this.form.controls[name]) {
      const method = disable ? 'disable': 'enable';
      this.form.controls[name][method]();
    }
    this.config = this.config.map((item) => {
      if (item.name === name) {
        item.disabled = disable;
      }
      return item;
    });
  }

  setValue(name: string, value: any) {
    if (this.form.controls[name]) {
      this.form.controls[name].setValue(value, {emitEvent: true})
    }
    let thisFldConfig = this.config.find((control) => control.name === name)
    if(thisFldConfig){
      thisFldConfig.value = value
      if(thisFldConfig.customUpdateWithLookup){
        // "WithLookup" implies we get an id here and need the rec
        this.db.getUniqueValueId(`${this.gs.entityBasePath}/${thisFldConfig.customLookupFld.path}`, 'id', value).subscribe(rec => {
          if(rec){
            let configToUpdate = this.config.find((control) => control.name === thisFldConfig.customUpdateWithLookup.fld)
            configToUpdate.value = configToUpdate.type == 'imagedisplay' ? this.us.getThumb(rec[thisFldConfig.customUpdateWithLookup.lookupFld]) : rec[thisFldConfig.customUpdateWithLookup.lookupFld]
          }
        })
      }
    }
  }

  objectValue(o, key) {
    //also only two levels!!
    let keys = key.split('.')
    if(keys.length == 2) {
      return o[keys[0]][keys[1]]
    } else return o[key]
  }
  
}
