import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadListComponent } from './lead-list/lead-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { TestDriveListComponent } from './test-drive-list/test-drive-list.component';
import { CallBackListComponent } from './call-back-list/call-back-list.component';
import { ReferralSourcesListComponent } from './referral-sources-list/referral-sources-list.component';
import { FaqListComponent } from './faq-list/faq-list.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "LeadList",
        component: LeadListComponent,
        data: { title: "LeadList" }
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "CustomerList",
        component: CustomerListComponent,
        data: { title: "CustomerList" }
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "TestDriveList",
        component: TestDriveListComponent,
        data: { title: "TestDriveList" }
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "CallBackList",
        component: CallBackListComponent,
        data: { title: "CallBackList" }
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "SourceMaster",
        component: ReferralSourcesListComponent,
        data: { title: "SourceMaster" }
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "FAQList",
        component: FaqListComponent,
        data: { title: "FAQList" }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadDetailsRoutingModule { }
