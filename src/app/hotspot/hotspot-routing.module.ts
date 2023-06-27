import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotspotComponent } from './hotspot/hotspot.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "HotspotList",
        component: HotspotComponent,
        data: { title: "HotspotList" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotspotRoutingModule { }
