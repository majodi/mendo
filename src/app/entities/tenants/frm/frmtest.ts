import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Validators } from '@angular/forms';

import { FieldConfig } from '../../../shared/dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from '../../../shared/dynamic-form/containers/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-frmtest',
//  styleUrls: ['app.component.scss'],
  template: `
    <div class="app">
      <dynamic-form
        [config]="config"
        #form="dynamicForm"
        (submit)="submit($event)">
      </dynamic-form>
      {{ form.valid }}
      {{ form.value | json }}
    </div>
  `
})
export class FrmTestComponent implements AfterViewInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  config: FieldConfig[] = [
    {
      type: 'input',
      label: 'Full name',
      name: 'name',
      placeholder: 'Enter your name',
      validation: [Validators.required, Validators.minLength(4)]
    },
    {
      type: 'chiplist',
      label: 'My Chiplist',
      name: 'mychiplist',
      options: ['lala','lolo','Knakworstje','dada'],
      placeholder: 'Select a chip option',
      customValidator: (value) => {return Object.keys(value).length > 0}
    },
    //type pulldown met lookup observer
    {
      type: 'select',
      label: 'Favourite Food',
      name: 'food',
      options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
      placeholder: 'Select an option',
      validation: [Validators.required]
    },
    {
      label: 'Submit',
      name: 'submit',
      type: 'button'
    }
  ];

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    let previousValid = this.form.valid;
    this.form.changes.subscribe(() => {
      if (this.form.valid !== previousValid) {
        previousValid = this.form.valid;
        this.form.setDisabled('submit', !previousValid);
      }
    });

    this.form.setDisabled('submit', true);
    this.form.setDisabled('mychiplist', true);
    this.form.setValue('name', 'Todd Motto');
    this.form.setValue('mychiplist', {'lolo': true, 'dada': true});
    this.form.setValue('food', 'Knakworstje');
    this.cd.detectChanges(); // nodig anders foutmelding
  }

  submit(value: {[name: string]: any}) {
    console.log(value);
  }
}