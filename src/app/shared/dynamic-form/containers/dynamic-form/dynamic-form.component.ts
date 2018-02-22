import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

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
        *ngFor="let field of config;"
        dynamicField
        [config]="field"
        [group]="form">
      </ng-container>
      <div [ngSwitch]="deleteState">
        <mat-dialog-actions *ngSwitchCase="false">
          <button mat-button type="submit" color="primary" [disabled]="!form.valid">Bewaar</button>
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
  deleteState = false

  get controls() { return this.config.filter(({type}) => type !== 'button'); }
  get changes() { return this.form.valueChanges; }
  get valid() { return this.form.valid; }
  get value() { return this.form.value; }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.createGroup();
  }

  ngOnChanges() {
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
        this.form.controls[name].setValue(value, {emitEvent: true})
        if((config.customValidator != undefined) && !config.customValidator(value)){
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
      if(config.type == 'pulldown'){
        this.value[config.name] = config.value
      }
      if(config.type == 'input' && config.inputValueTransform != undefined){
        this.value[config.name] = config.inputValueTransform(config.value)
      }
    })
    this.submit.emit({response: action, value: this.value});  
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
      this.config.find((control) => control.name === name).value = value
    }
  }

}
