import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTemplateComponent } from './modal-template/modal-template.component';
import { LanguageModalComponent } from './language-modal/language-modal.component';
import { HtmlPipeModule } from '../shared/pipes/html-pipe/html-pipe.module';



@NgModule({
  declarations: [
    ModalTemplateComponent,
    LanguageModalComponent
  ],
  imports: [
    CommonModule,
    HtmlPipeModule
  ],
  exports: [
    LanguageModalComponent
  ]
})
export class ModalsModule { }
