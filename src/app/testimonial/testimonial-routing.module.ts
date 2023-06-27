import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "TestimonialList",
        component: TestimonialListComponent,
        data: { title: "TestimonialList" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestimonialRoutingModule { }
