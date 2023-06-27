import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { BlogListComponent } from './blog-list/blog-list.component';
import { AccessManagementComponent } from './access-management/access-management.component';
import { BannerComponent } from './banner/banner.component';
import { MaterialModule } from './../shared/material/material.module';
import { PositionMasterComponent } from './position-master/position-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  declarations: [
    BlogListComponent,
    AccessManagementComponent,
    BannerComponent,
    PositionMasterComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    UserManagementRoutingModule,
    SharedModule,MaterialModule
  ]
})
export class UserManagementModule { }
