import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormButtonComponent } from './form-button.component';
import { FormInputComponent } from './form-input.component';
import { FormSelectComponent } from './form-select.component';
import { FormPulldownComponent } from './form-pulldown.component';
import { FormLookupComponent } from './form-lookup.component';
import { FormFilepickComponent } from './form-filepick.component';
import { FormImagedisplayComponent } from './form-imagedisplay.component';
import { FormStringdisplayComponent } from './form-stringdisplay.component';

import { FormChiplistComponent } from './form-chiplist.component';

import { Field } from '../models/field.interface';
import { FieldConfig } from '../models/field-config.interface';

const components: {[type: string]: Type<Field>} = {
  button: FormButtonComponent,
  input: FormInputComponent,
  select: FormSelectComponent,
  chiplist: FormChiplistComponent,
  pulldown: FormPulldownComponent,
  lookup: FormLookupComponent,
  filepick: FormFilepickComponent,
  imagedisplay: FormImagedisplayComponent,
  stringdisplay: FormStringdisplayComponent,
};

@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit {
  @Input()
  config: FieldConfig;

  @Input()
  group: FormGroup;

  @Input()
  formAction: number;

  component: ComponentRef<Field>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
    }
  }

  ngOnInit() {
    if (!components[this.config.type]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `Trying to use an unsupported type (${this.config.type}).
        Supported types: ${supportedTypes}`
      );
    }
    // let ctrlType: string = !(this.formAction == 0 && this.config.type == 'chiplist') ? this.config.type : 'select'
    let ctrlType: string = this.config.type
    const component = this.resolver.resolveComponentFactory<Field>(components[ctrlType]);
    this.component = this.container.createComponent(component);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }
}
