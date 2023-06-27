import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthLayoutComponent} from './shared/Component/Layout/auth-layout/auth-layout.component'
import { AdminlayoutComponent } from './shared/Component/Layout/adminlayout/adminlayout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'session/Login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'session',
        loadChildren: () => import('./session/session.module').then(m => m.SessionModule),
        data: { title: ''}
      }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { title: 'Dashboard', breadcrumb: 'Dashboard'}
      }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule),
        data: { title: 'UserManagement', breadcrumb: 'UserManagement'}
      }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./lead-details/lead-details.module').then(m => m.LeadDetailsModule),
        data: { title: 'LeadDetails', breadcrumb: 'LeadDetails'}
      }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule),
        data: { title: 'Vehicle', breadcrumb: 'Vehicle'}
      }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./feedback-reviews/feedback-reviews.module').then(m => m.FeedbackReviewsModule),
        data: { title: 'Feedback', breadcrumb: 'Feedback'}
      }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./testimonial/testimonial.module').then(m => m.TestimonialModule),
        data: { title: 'TestimonialList', breadcrumb: 'TestimonialList'}
      }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
        data: { title: 'FeatureList', breadcrumb: 'FeatureList'}
      }
    ]
  },
  {
    path:'',
    component:AdminlayoutComponent,
    canActivate:[],
    children:[
      {
        path:'Feature',
        loadChildren: () => import('./feature2/feature2.module').then(m => m.Feature2Module),
        data: {title:'Feature2Component',breadcrumb:'Feature2'}
      }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [],
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./hotspot/hotspot.module').then(m => m.HotspotModule),
        data: { title: 'HotspotList', breadcrumb: 'HotspotList'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
