import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "InventoryList",
        component: VehicleListComponent,
        data: { title: "InventoryList" }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
