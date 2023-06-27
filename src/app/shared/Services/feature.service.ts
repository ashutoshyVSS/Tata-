 import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment, } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  private cvAdminUrlV1 = `${environment.baseUrl}/api/v1/cv_online/`;
  private cvAdminUrlV2 = `${environment.baseUrl}/api/v2/cv_online/`;
  readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) { }

  getFeatureList(data: any): Observable<any> {
    return this.http.post(`${this.cvAdminUrlV2}get_feature/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }

  uploadFeatureImagesZip(data: any): Observable<any> {
    return this.http.post(`${this.cvAdminUrlV2}upload_feature_images/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }
  insertUpdateFeature(data: any): Observable<any> {
    return this.http.post(`${this.cvAdminUrlV2}bulk_insert_update_feature/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }
}
