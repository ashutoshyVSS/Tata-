import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessManagementComponent } from './access-management/access-management.component';
import { BannerComponent } from './banner/banner.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { PositionMasterComponent } from './position-master/position-master.component';
import { RegistrationComponent } from './registration/registration.component';
const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "BannerUpload",
        component: BannerComponent,
        data: { title: "BannerUpload" }
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "RolePageMapping",
        component: AccessManagementComponent,
        data: { title: "RolePageMapping" }
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "BlogList",
        component: BlogListComponent,
        data: { title: "BlogList" }
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "Positionmaster",
        component: PositionMasterComponent,
        data: { title: "Position Master" }
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "RegistrationList",
        component: RegistrationComponent,
        data: { title: "Registration List" }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
