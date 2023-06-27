import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import { MaterialModule } from './../shared/material/material.module';

import { LeadDetailsRoutingModule } from './lead-details-routing.module';
import { LeadListComponent } from './lead-list/lead-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { TestDriveListComponent } from './test-drive-list/test-drive-list.component';
import { CallBackListComponent } from './call-back-list/call-back-list.component';
import { ReferralSourcesListComponent } from './referral-sources-list/referral-sources-list.component';
import { FaqListComponent } from './faq-list/faq-list.component';


@NgModule({
  declarations: [
    LeadListComponent,
    CustomerListComponent,
    TestDriveListComponent,
    CallBackListComponent,
    ReferralSourcesListComponent,
    FaqListComponent
  ],
  imports: [
    CommonModule,
    LeadDetailsRoutingModule,SharedModule,
    MaterialModule
  ]
})
export class LeadDetailsModule { }
