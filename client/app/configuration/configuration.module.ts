import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { Configuration1Component } from './configuration1/configuration1.component';
import { ProgressComponent } from './progress/progress.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationFormComponent } from './configuration-form-template/configuration-form-template.component';
import { ModalsModule } from '../modals/modals.module';
import { Configuration2Component } from './configuration2/configuration2.component';
import { ManagerModule } from '../manager/manager.module';
import { HtmlPipeModule } from '../shared/pipes/html-pipe/html-pipe.module';
import { Configuration3Component } from './configuration3/configuration3.component';

@NgModule({
  declarations: [
    ConfigurationComponent,
    Configuration1Component,
    ProgressComponent,
    ConfigurationFormComponent,
    Configuration2Component,
    Configuration3Component,
  ],
  imports: [
    CommonModule,
    ModalsModule,
    FormsModule,
    ManagerModule,
    HtmlPipeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfigurationModule { }
