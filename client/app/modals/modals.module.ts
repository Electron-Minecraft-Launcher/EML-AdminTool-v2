import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTemplateComponent } from './modal-template/modal-template.component';
import { LanguageModalComponent } from './language-modal/language-modal.component';



@NgModule({
  declarations: [
    ModalTemplateComponent,
    LanguageModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LanguageModalComponent
  ]
})
export class ModalsModule { }
