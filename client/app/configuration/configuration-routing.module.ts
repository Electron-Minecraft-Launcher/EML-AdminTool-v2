import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Configuration1Component } from './configuration1/configuration1.component';

const routes: Routes = [
  { path: 'configure', component: Configuration1Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
