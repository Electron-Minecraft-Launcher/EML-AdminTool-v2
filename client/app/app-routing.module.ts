import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { ConfigurationRoutingModule } from './configuration/configuration-routing.module';
import { HomeRoutingModule } from './home/home-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  ...HomeRoutingModule.routes,
  ...ConfigurationRoutingModule.routes,
  { path: '', component: AppComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
