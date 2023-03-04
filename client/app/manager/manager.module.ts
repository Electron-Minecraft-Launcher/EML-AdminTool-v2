import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSplashComponent } from './loading-splash/loading-splash.component';
import { SkeletonComponent } from './skeleton/skeleton.component';



@NgModule({
  declarations: [
    LoadingSplashComponent,
    SkeletonComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingSplashComponent
  ]
})
export class ManagerModule { }
