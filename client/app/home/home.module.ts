import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigureInterceptor } from '../shared/interceptors/configure.interceptor';
import { ManagerModule } from '../manager/manager.module';
import { FormsModule } from '@angular/forms';
import { ModalsModule } from '../modals/modals.module';
import { HtmlPipeModule } from '../shared/pipes/html-pipe/html-pipe.module';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent
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
    }
  ]
})
export class HomeModule { }
