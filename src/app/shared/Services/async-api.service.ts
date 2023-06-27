import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment, } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsyncApiService {
  private cvAdminUrlV1 = `${environment.baseUrl}/api/v1/cv_online/`;
  readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }
  async exportLeadList(Data: any):Promise<any>
  {
    return this.http.post(`${this.cvAdminUrlV1}admin/get_all_payments/`, Data, this.options);
  }

  async exportTestDriveList(Data: any):Promise<any>
  {
    return this.http.post(`${this.cvAdminUrlV1}admin/td_bookings/`, Data, this.options);
  }

  async exportCallBackTestDriveList(Data: any):Promise<any>
  {
    return this.http.post(`${this.cvAdminUrlV1}admin/get_call_requests/`, Data, this.options);
  }
}
