import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotspotRoutingModule } from './hotspot-routing.module';
import { HotspotComponent } from './hotspot/hotspot.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    HotspotComponent
  ],
  imports: [
    CommonModule,
    HotspotRoutingModule,SharedModule
  ]
})
export class HotspotModule { }
