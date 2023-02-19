import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSplashComponent } from './loading-splash/loading-splash.component';



@NgModule({
  declarations: [
    LoadingSplashComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingSplashComponent
  ]
})
export class ManagerModule { }
