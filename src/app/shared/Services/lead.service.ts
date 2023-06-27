import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment, } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private cvAdminUrlV1 = `${environment.baseUrl}/api/v1/cv_online/`;
  private cvAdminUrlV2 = `${environment.baseUrl}/api/v2/cv_online/`;
  private TestDriveListURL = `${environment.baseUrl}/api/v1/cv_online/admin/td_bookings/`;

  readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  constructor(private http: HttpClient) { }
  getLeadList(data: any): Observable<any> {

    return this.http.post(`${this.cvAdminUrlV1}get_leads/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }
  getEGURULeadList(data: any): Observable<any> {

    return this.http.post(`${this.cvAdminUrlV2}get_token_details/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }

  getCustomerList(data: any): Observable<any> {

    return this.http.post(`${this.cvAdminUrlV1}admin/get_customers/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }

  getTestDriveList(data: any): Observable<any> {

    return this.http.post(`${this.cvAdminUrlV1}admin/td_bookings/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }

  getCallBackList(data: any): Observable<any> {

    return this.http.post(`${this.cvAdminUrlV1}admin/get_call_requests/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }

  SourceList(data: any): Observable<any> {
    return this.http.post<any>(`${this.cvAdminUrlV1}admin/get_lead_source/`, data).pipe(catchError(this.handlError));
  }

  getFaqList(data: any): Observable<any> {
    return this.http.post<any>(`${this.cvAdminUrlV1}get_faq/`, data).pipe(catchError(this.handlError));
  }

  FaqAddUpdate(data: any): Observable<any> {
    return this.http.post<any>(`${this.cvAdminUrlV1}admin/faq/`, data).pipe(catchError(this.handlError));
  }

  getLeadDetail(data:any):Observable<any>
  {
     return this.http.post<any>(`${this.cvAdminUrlV1}admin/lead_detail/`,data).pipe(catchError(this.handlError));
  }

  //Export excel services
  // TestDriveList(data: any): Observable<any> {
  //   return this.http.post<any>(this.TestDriveListURL, data).pipe(catchError(this.handlError));
  // }

  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }
}
