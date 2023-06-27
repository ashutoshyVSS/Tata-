import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private testimonialListUrl = `${environment.baseUrl}/api/v1/cv_online/admin/get_testimonials/`;
  private ApproveRejectFeedbakURL = `${environment.baseUrl}/api/v1/cv_online/admin/testimonial_status/`;
  private GetPplURL = `${environment.baseUrl}/api/v1/cv_online/admin/ppl_s/ `; 
  private GetModelURL = `${environment.baseUrl}/api/v1/cv_online/admin/get_models/ `; 
  private GetLobURL = `${environment.baseUrl}/api/v1/cv_online/admin/lob_s/ `; 
  private GetApplicationURL = `${environment.baseUrl}/api/v1/cv_online/get_vehicle_applications/ `; 
  
  constructor(private http: HttpClient) { }

  testiominalList(data: any): Observable<any> {
    return this.http.post<any>(this.testimonialListUrl, data, this.options).pipe(catchError(this.handlError));
  }

  ApproveRejectFeedbak(data: any): Observable<any> {
    return this.http.post<any>(this.ApproveRejectFeedbakURL, data, this.options).pipe(catchError(this.handlError));
  }

  GetPplList(data:any):Observable<any>{
     return this.http.post<any>(this.GetPplURL,data).pipe(catchError(this.handlError));
  }

  GetModelList(data: any):Observable<any>{
     return this.http.post<any>(this.GetModelURL,data).pipe(catchError(this.handlError));
  }

  GetLobList(data: any):Observable<any>{
     return this.http.post<any>(this.GetLobURL,data).pipe(catchError(this.handlError));
  }

  GetApplicationList(data: any):Observable<any>{
     return this.http.post<any>(this.GetApplicationURL,data).pipe(catchError(this.handlError))
  }

  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }
}
