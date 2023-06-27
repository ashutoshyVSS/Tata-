import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionRoutingModule } from './session-routing.module';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from './../shared/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    LoginComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    MatButtonModule,MaterialModule, FormsModule,
    ReactiveFormsModule,
  ],
  providers:[DatePipe]
})
export class SessionModule { }
