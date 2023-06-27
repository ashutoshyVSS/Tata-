import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Feature2Component } from './feature2/feature2.component';

const routes: Routes = [
  {
    path:"",
    children:[
      {
        path:"Feature2",
        component:Feature2Component,
        data: { title:Feature2Component}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Feature2RoutingModule { }
