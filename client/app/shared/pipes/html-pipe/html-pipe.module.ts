import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlPipe } from './html.pipe';



@NgModule({
  declarations: [
    HtmlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [HtmlPipe]
})
export class HtmlPipeModule { }
