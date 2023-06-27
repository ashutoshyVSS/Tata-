import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureComponent } from './feature/feature.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "FeatureList",
        component: FeatureComponent,
        data: { title: "FeatureList" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
