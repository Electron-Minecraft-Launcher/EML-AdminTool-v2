import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { Configuration1Component } from './configuration1/configuration1.component';
import { ProgressComponent } from './progress/progress.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationFormComponent } from './configuration-form-template/configuration-form-template.component';
import { ModalTemplateComponent } from '../modals/modal-template/modal-template.component';
import { ManagerModule } from '../manager/manager.module';
import { LanguageModalComponent } from '../modals/language-modal/language-modal.component';
import { ModalsModule } from '../modals/modals.module';

@NgModule({
  declarations: [
    ConfigurationComponent,
    Configuration1Component,
    ProgressComponent,
    ConfigurationFormComponent
  ],
  imports: [
    CommonModule,
    ModalsModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfigurationModule { }
