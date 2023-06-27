import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "Login",
        component: LoginComponent,
        data: { title: "Login" }
      }
    ]
  },
  {path:'NOTFound',component:PageNotFoundComponent,data: { title: 'NOTFound', breadcrumb: 'NOTFound' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
