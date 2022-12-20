import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Configuration1Component } from './configuration1/configuration1.component';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  declarations: [
    Configuration1Component,
    ProgressComponent
  ],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfigurationModule { }
