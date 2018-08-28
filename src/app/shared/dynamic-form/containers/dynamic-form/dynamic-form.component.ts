import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'

import { UploadService } from '../../../../services/upload.service'
import { GlobService } from '../../../../services/glob.service'
import { DbService } from '../../../../services/db.service'

import { FieldConfig } from '../../models/field-config.interface'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../form-dialog/form-dialog.component'

@Component({
  exportAs: 'dynamicForm',
  // tslint:disable-next-line:component-selector
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
        [formAction]="formAction"
        [onValueChg]="onValueChg"
        [form]="form"
        [dialogRef]="dialogRef">
      </ng-container>
      <mat-hint *ngIf="info" align="end" style="color:red">{{info}}</mat-hint>
      <mat-progress-bar *ngIf="us.progress > 0" mode="determinate" [value]="us.progress"></mat-progress-bar>
      <div [ngSwitch]="deleteState">
        <mat-dialog-actions *ngSwitchCase="false">
          <button mat-button type="submit" color="primary" [disabled]="!form.valid || waitOnUpload">Bewaar</button>
          <button mat-button type="button" (click)="handleSubmit('cancel')" color="primary">Annuleer</button>
          <span class="spacer"></span>
          <button mat-icon-button (click)="deleteState=true" color="primary" [disabled]="formAction==1 || formAction==10">
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
  @Input() config: FieldConfig[] = []
  @Input() formAction = 0
  @Input() onValueChg: Function
  @Input() dialogRef: MatDialogRef<FormDialogComponent>
  @Output() submit: EventEmitter<any> = new EventEmitter<any>()
  form: FormGroup
  toPopulate: FieldConfig[] = []
  deleteState = false
  waitOnUpload = false
  info = ''

  get controls() { return this.config.filter(({type}) => !['button', 'imagedisplay', 'stringdisplay'].includes(type)) } // filter controls that have no custom ctrl
  get changes() { return this.form.valueChanges }
  get valid() { return this.form.valid }
  get value() { return this.form.value }

  constructor(
    private fb: FormBuilder,
    public  us: UploadService,
    private gs: GlobService,
    private db: DbService,
  ) {}

  ngOnInit() {
    this.info = ''
    if (this.formAction !== 0) {
      this.setToPopulate()
    } else {this.toPopulate = this.config}
    this.form = this.createGroup()
  }

  ngOnChanges() {
    if (this.formAction !== 0) {
      this.setToPopulate()
    } else {this.toPopulate = this.config}
    if (this.form) {
      const controls = Object.keys(this.form.controls)
      const configControls = this.controls.map((item) => item.name)

      controls
        .filter((control) => !configControls.includes(control))
        .forEach((control) => this.form.removeControl(control))

      configControls
        .filter((control) => !controls.includes(control))
        .forEach((name) => {
          const config = this.config.find((control) => control.name === name)
          this.form.addControl(name, this.createControl(config))
        })

    }
  }

  createGroup() {
    const group = this.fb.group({})
    this.controls.forEach(control => {group.addControl(control.name, this.createControl(control))})
    return group
  }

  createControl(config: FieldConfig) {
    const { disabled, validation, value } = config
    const newCtrl = this.fb.control({ disabled, value }, validation)
    if (!['button', 'input', 'select', 'checkbox', 'datepicker'].includes(config.type)) { // does it need a custom value change
      config.customValueChg = (name: string, _value: any) => { // for custom components
        this.info = (this.formAction === 0 && config.type === 'chiplist' && Object.keys(_value).length > 1) ? 'Tags: alleen eerste waarde wordt gebruikt!' : ''
        this.setFormValue(name, config.type === 'lookup' ? _value['id'] : _value)
        if ((config.customValidator !== undefined) && !config.customValidator(config.type === 'lookup' ? _value['id'] : _value)) {
          this.form.controls[name].setErrors({'invalid': true}, {emitEvent: true})
        }
      }
    }
    return newCtrl
  }

  handleSubmit(action: string, event?: Event) {
    // console.log('handle: ', action, event)
    if (event !== undefined) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.config.forEach(config => {
      if (['datepicker', 'chiplist', 'lookup', 'pulldown', 'stringdisplay', 'selectchildren'].includes(config.type)) {
        this.value[config.name] = config.value
      }
      if (config.type === 'filepick' && this.formAction === 1) { // only on insert!!
        this.waitOnUpload = true
        this.us.pushUpload(config.customFile).subscribe(url => {
          if (url) {
            this.waitOnUpload = false
            this.us.progress = 0
            this.value['fileName'] = config.customFile.name
            this.value[config.name] = url
            this.submit.emit({response: action, value: this.value})
        }
        })
      }
      if (config.type === 'input' && config.inputValueTransform !== undefined) {
        this.value[config.name] = config.inputValueTransform(config.value)
      }
    })
    if (!this.waitOnUpload) {
      this.submit.emit({response: action, value: this.value})
    }
  }

  setDisabled(name: string, disable: boolean) {
    // console.log(': ', this.form.controls)
    if (this.form.controls[name]) {
      const method = disable ? 'disable' : 'enable'
      this.form.controls[name][method]()
    }
    this.config = this.config.map((item) => {
      if (item.name === name) {
        item.disabled = disable
      }
      return item
    })
  }

  setValue(name: string, value: any) { // used by caller
    this.setFormValue(name, value)
  }

  setFormValue(name, value) {
    if (this.form.controls[name]) {
      this.form.controls[name].setValue(value, {emitEvent: true})
    }
    const configIndex = this.config.findIndex(c => c.name === name)
    if (configIndex !== -1) {
      this.config[configIndex].value = value
      if (this.config[configIndex].customUpdateWithLookup) {
        this.config[configIndex].customUpdateWithLookup.forEach(customUpdate => {
          const configToUpdate = this.config.find((control) => control.name === customUpdate.fld)
          if ((configToUpdate !== undefined) && (!configToUpdate.value || (customUpdate.onlyVirgin === undefined || !customUpdate.onlyVirgin))) {
            if (this.config[configIndex].type === 'lookup' || this.config[configIndex].type === 'pulldown') {
              this.db.getUniqueValueId(`${this.gs.entityBasePath}/${this.config[configIndex].customLookupFld.path}`, 'id', value).subscribe(rec => {
                if (rec) {
                  if (customUpdate.lookupFunction) {
                    // check again due to async!
                    configToUpdate.value = (!configToUpdate.value || (customUpdate.onlyVirgin === undefined || !customUpdate.onlyVirgin)) ? customUpdate.lookupFunction(rec, this.gs) : configToUpdate.value
                  } else {
                    // check again due to async!
                    configToUpdate.value = (!configToUpdate.value || (customUpdate.onlyVirgin === undefined || !customUpdate.onlyVirgin)) ? rec[customUpdate.lookupFld] : configToUpdate.value
                  }
                  if (this.onValueChg !== undefined) { this.onValueChg(name, value, this.formAction) }
                  this.setToPopulate()
                  if (this.form.controls[configToUpdate.name]) {
                    this.form.controls[configToUpdate.name].setValue(configToUpdate.value, {emitEvent: true})
                  }
                }
              })
            } else {
              configToUpdate.value = value
              if (this.onValueChg !== undefined) { this.onValueChg(name, value, this.formAction) }
              this.setToPopulate()
            }
          }
        })
      } else {
        if (this.onValueChg !== undefined) { this.onValueChg(name, value, this.formAction) }
        this.setToPopulate()
      }
    }
  }

  setToPopulate() {
    this.toPopulate = this.config
    .filter(c => {
      return !(c.doNotPopulate !== undefined && c.doNotPopulate)
    })
  }

  objectValue(o, key) {
    // also only two levels!!
    const keys = key.split('.')
    if (keys.length === 2) {
      return o[keys[0]][keys[1]]
    } else { return o[key] }
  }

}
