import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackReviewsRoutingModule } from './feedback-reviews-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    FeedbackListComponent
  ],
  imports: [
    CommonModule,
    FeedbackReviewsRoutingModule,SharedModule,NgbModule
  ]
})
export class FeedbackReviewsModule { }
