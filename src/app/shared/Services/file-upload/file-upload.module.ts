import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FileAppinterceptorService } from '../MyServices/appinterceptor.service';
import { FileUploadService } from './file-upload.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,HttpClientModule
  ],
  providers: [FileUploadService,
    {provide: HTTP_INTERCEPTORS, useClass: FileAppinterceptorService, multi: true},
  ],
})
export class FileUploadModule { }
