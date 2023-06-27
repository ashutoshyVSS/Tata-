import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  
  constructor(private http: HttpClient, private _Router: Router) { }
  //Lead List
  LOBList(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/api/v1/cv_online/admin/lob_s/`, data).pipe(catchError(this.handlError));
  }

  PPLList(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/api/v1/cv_online/admin/ppl_s/`, data).pipe(catchError(this.handlError));
  }

  PLLIST(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/api/v1/cv_online/admin/pl_s/`, data).pipe(catchError(this.handlError));
  }

  // Test Drive List
  TestDriveProdModelFilterDropdown(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/api/v1/cv_online/td_ppl_or_model/`, data).pipe(catchError(this.handlError));
  }

  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }
}
