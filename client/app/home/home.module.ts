import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigureInterceptor } from '../shared/interceptors/configure.interceptor';
import { AuthInterceptor } from '../shared/interceptors/auth.interceptor';
import { ManagerModule } from '../manager/manager.module';
import { FormsModule } from '@angular/forms';
import { ModalsModule } from '../modals/modals.module';
import { HtmlPipeModule } from '../shared/pipes/html-pipe/html-pipe.module';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    LeftPanelComponent
  ],
  imports: [
    CommonModule,
    ModalsModule,
    FormsModule,
    ManagerModule,
    HtmlPipeModule,
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ConfigureInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class HomeModule { }
