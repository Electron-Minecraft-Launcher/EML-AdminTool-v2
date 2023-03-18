import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSplashComponent } from './loading-splash/loading-splash.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { HtmlPipe } from '../shared/pipes/html-pipe/html.pipe';
import { HtmlPipeModule } from '../shared/pipes/html-pipe/html-pipe.module';



@NgModule({
  declarations: [
    LoadingSplashComponent,
    SkeletonComponent,
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    HtmlPipeModule
  ],
  exports: [
    LoadingSplashComponent,
    SkeletonComponent,
    NotificationsComponent
  ]
})
export class ManagerModule { }
