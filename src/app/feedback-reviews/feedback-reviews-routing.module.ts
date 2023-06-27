import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "FeedBackList",
        component: FeedbackListComponent,
        data: { title: "FeedBackList" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackReviewsRoutingModule { }
