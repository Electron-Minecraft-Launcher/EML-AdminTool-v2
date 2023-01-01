import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { ConfigurationRoutingModule } from './configuration/configuration-routing.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ManagerModule } from './manager/manager.module';
import { ManagerRoutingModule } from './manager/manager-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ConfigurationModule,
    ConfigurationRoutingModule,
    ManagerModule,
    ManagerRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
