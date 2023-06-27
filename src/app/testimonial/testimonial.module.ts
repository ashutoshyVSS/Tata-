import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialRoutingModule } from './testimonial-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';


@NgModule({
  declarations: [TestimonialListComponent],
  imports: [
    CommonModule,SharedModule,NgbModule,
    TestimonialRoutingModule
  ]
})
export class TestimonialModule { }
