import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import { MaterialModule } from './../shared/material/material.module';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';


@NgModule({
  declarations: [
    VehicleListComponent,
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,SharedModule,
    MaterialModule
  ]
})
export class VehicleModule { }
