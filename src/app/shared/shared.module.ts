import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizeService } from './Services/authorize.service';
import { AuthGuard } from './Services/auth/auth.guard';
import { AppConfirmService } from './Services/app-confirm/app-confirm.service';
import { SharedRoutingModule } from './shared-routing.module';
import { InputRestrictionDirective } from './Directives/input-restriction.directive';
import { AuthLayoutComponent } from './Component/Layout/auth-layout/auth-layout.component';
import { AdminlayoutComponent } from './Component/Layout/adminlayout/adminlayout.component';
import { HeaderComponent } from './Component/header/header.component';
import { FooterComponent } from './Component/footer/footer.component';
import { AppLoaderComponent } from './Component/app-loader/app-loader.component';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SubmenuListComponent } from './Component/submenu-list/submenu-list.component';
import { FilterComponent } from './Component/filter/filter.component';
import { PaginationComponent } from './Component/pagination/pagination.component';
import {AppinterceptorService} from '../shared/Services/MyServices/appinterceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportDownloadPopupComponent } from './Component/modals/report-download-popup/report-download-popup.component';
import { LeadListDetailsComponent } from './Component/modals/lead-list-details/lead-list-details.component';
import { FaqAddEditComponent } from './Component/modals/faq-add-edit/faq-add-edit.component';
import { VehicleDetailsComponent } from './Component/modals/vehicle-details/vehicle-details.component';
import { FeedbackDetailsComponent } from './Component/modals/feedback-details/feedback-details.component';
import { VehicleBulkUploadComponent } from './Component/modals/vehicle-bulk-upload/vehicle-bulk-upload.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { TestimonialAddEditComponent } from './Component/modals/testimonial-add-edit/testimonial-add-edit.component';
import { PositionMasterDetailsComponent } from './Component/modals/position-master-details/position-master-details.component';
import { BannerDetailsComponent } from './Component/modals/banner-details/banner-details.component';
// import { FileUploadModule } from './Services/file-upload/file-upload.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { DateFormat } from 'src/app/date-format';
import { AddBlogComponent } from './Component/modals/add-blog/add-blog.component';
import { RegistrationDetailsComponent } from './Component/modals/registration-details/registration-details.component';
import { FeatureUploadComponent } from './Component/modals/feature-upload/feature-upload.component';
import { AddHotspotComponent } from './Component/modals/add-hotspot/add-hotspot.component';

const components = [AuthLayoutComponent, AdminlayoutComponent, HeaderComponent, FooterComponent,
  AppLoaderComponent, FilterComponent,PaginationComponent,ReportDownloadPopupComponent,TestimonialAddEditComponent,
  SubmenuListComponent,LeadListDetailsComponent,FaqAddEditComponent,VehicleDetailsComponent,FeedbackDetailsComponent,VehicleBulkUploadComponent,
  PositionMasterDetailsComponent,BannerDetailsComponent,AddBlogComponent,RegistrationDetailsComponent,FeatureUploadComponent,AddHotspotComponent]
@NgModule({
  declarations: [InputRestrictionDirective,components, LeadListDetailsComponent, FaqAddEditComponent, VehicleDetailsComponent,
    FeedbackDetailsComponent, TestimonialAddEditComponent, AddBlogComponent, FeatureUploadComponent, AddHotspotComponent, ],

  imports: [
    CommonModule,
    SharedRoutingModule,
    MatIconModule,
    NgbModule, NgbDatepickerModule,FormsModule,ReactiveFormsModule,NgSelectModule,
    CKEditorModule,
    MatIconModule,MatDatepickerModule,MatInputModule,MatFormFieldModule,MatNativeDateModule,
    NgbModule, NgbDatepickerModule,FormsModule,ReactiveFormsModule,NgSelectModule,
  ],
  providers: [AuthorizeService,
    AuthGuard,
    AppConfirmService, 
    {provide: HTTP_INTERCEPTORS, useClass: AppinterceptorService, multi: true},
    { provide: DateAdapter, useClass: DateFormat }
  ],
  exports: [
    InputRestrictionDirective,components,NgSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
 }
