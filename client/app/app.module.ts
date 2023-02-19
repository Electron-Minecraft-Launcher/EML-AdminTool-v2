import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { ConfigurationRoutingModule } from './configuration/configuration-routing.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ManagerModule } from './manager/manager.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { LanguageService } from './shared/services/language.service';
import { HtmlPipeModule } from './shared/pipes/html-pipe/html-pipe.module';

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
    ManagerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
