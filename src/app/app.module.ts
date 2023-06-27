import { APP_INITIALIZER,NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import {MatButtonModule} from '@angular/material/button'; 
import { MatSelectModule } from '@angular/material/select';  
import {MatIconModule} from '@angular/material/icon';
import {SharedModule} from './shared/shared.module'
import { ToastrModule } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';
import { CommonModule,DatePipe } from "@angular/common";
import {CustomLocationStrategy} from '../app/custom-location-strategy';
import { LocationStrategy} from '@angular/common';
import { FileUploadModule } from './shared/Services/file-upload/file-upload.module';
import {NgbDateFRParserFormatter} from '../app/datepickerFormatter'
// import {HTTP_INTERCEPTORS} from '@angular/common/http';
// import {AppinterceptorService} from './shared/Services/MyServices/appinterceptor.service';
// import {HTTP_INTERCEPTORS} from '@angular/common/http';
export function init_app(router: Router){
  return ()  => { 
    return new Promise((resolve,reject) => {
      return setTimeout(() => resolve(true), 1000);
    })
  }
  
}
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    MatButtonModule, 
    MatSelectModule,
    MatIconModule, ToastrModule.forRoot(), FileUploadModule,
    RouterModule.forRoot(routes, { useHash: false,  scrollPositionRestoration: 'enabled', scrollOffset: [0, 0],
    anchorScrolling: 'enabled',})
  ],
  providers: [DatePipe,TitleCasePipe,
    {provide: LocationStrategy, useClass: CustomLocationStrategy}, 
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter},
    // {provide: HTTP_INTERCEPTORS, useClass: AppinterceptorService, multi: true},
    { provide: APP_INITIALIZER, useFactory: init_app, multi: true, deps: [Router] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
