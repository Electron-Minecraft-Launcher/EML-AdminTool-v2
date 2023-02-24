import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { ConfigurationRoutingModule } from './configuration/configuration-routing.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ManagerModule } from './manager/manager.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeModule } from './home/home.module';
import { HomeRoutingModule } from './home/home-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ConfigurationModule,
    ConfigurationRoutingModule,
    HomeModule,
    HomeRoutingModule,
    ManagerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
