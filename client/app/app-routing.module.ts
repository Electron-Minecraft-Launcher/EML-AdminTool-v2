import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { ConfigurationRoutingModule } from './configuration/configuration-routing.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { LoadingSplashComponent } from './manager/loading-splash/loading-splash.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  ...ConfigurationRoutingModule.routes,
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
