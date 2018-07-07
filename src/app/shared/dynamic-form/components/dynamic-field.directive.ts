import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type, ViewContainerRef } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { FormButtonComponent } from './form-button.component'
import { FormInputComponent } from './form-input.component'
import { FormDateComponent } from './form-date.component'
import { FormSelectComponent } from './form-select.component'
import { FormPulldownComponent } from './form-pulldown.component'
import { FormLookupComponent } from './form-lookup.component'
import { FormFilepickComponent } from './form-filepick.component'
import { FormImagedisplayComponent } from './form-imagedisplay.component'
import { FormStringdisplayComponent } from './form-stringdisplay.component'
import { FormCheckboxComponent } from './form-checkbox.component'

import { FormChiplistComponent } from './form-chiplist.component'

import { Field } from '../models/field.interface'
import { FieldConfig } from '../models/field-config.interface'
import { FormSelectChildrenComponent } from './form-selectchildren.component'
import { MatDialogRef } from '@angular/material'
import { FormDialogComponent } from '../containers/form-dialog/form-dialog.component'

const components: {[type: string]: Type<Field>} = {
  button: FormButtonComponent,
  input: FormInputComponent,
  datepicker: FormDateComponent,
  select: FormSelectComponent,
  chiplist: FormChiplistComponent,
  pulldown: FormPulldownComponent,
  lookup: FormLookupComponent,
  filepick: FormFilepickComponent,
  imagedisplay: FormImagedisplayComponent,
  stringdisplay: FormStringdisplayComponent,
  checkbox: FormCheckboxComponent,
  selectchildren: FormSelectChildrenComponent
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit {
  @Input()
  config: FieldConfig

  @Input()
  group: FormGroup

  @Input()
  formAction: number

  @Input()
  onValueChg: Function

  @Input()
  form: FormGroup

  @Input()
  dialogRef: MatDialogRef<FormDialogComponent>

  component: ComponentRef<Field>

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config
      this.component.instance.group = this.group
      this.component.instance.onValueChg = this.onValueChg
    }
  }

  ngOnInit() {
    if (!components[this.config.type]) {
      const supportedTypes = Object.keys(components).join(', ')
      throw new Error(
        `Trying to use an unsupported type (${this.config.type}).
        Supported types: ${supportedTypes}`
      )
    }
    const ctrlType: string = this.config.type
    const component = this.resolver.resolveComponentFactory<Field>(components[ctrlType])
    this.component = this.container.createComponent(component)
    this.component.instance.config = this.config
    this.component.instance.group = this.group
    this.component.instance.onValueChg = this.onValueChg
    this.component.instance.form = this.form
    this.component.instance.dialogRef = this.dialogRef
  }
}
