import { Injectable } from '@angular/core';
import { environment} from 'src/environments/environment';
import {HttpClient,HttpParams, HttpErrorResponse} from '@angular/common/http'
import {catchError, map} from 'rxjs/operators';
import {BehaviorSubject, forkJoin, of, throwError, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public tabValue: BehaviorSubject<any>  = new BehaviorSubject<any>(null);
  private DashboardAPi = `${environment.baseUrl}/api/v1/cv_online/admin/dashboard/`;
  constructor(private http: HttpClient) { 
    let tab = localStorage.getItem('tab') ? JSON.parse(localStorage.getItem('tab') || '') : null
    this.tabValue = new BehaviorSubject<any>(tab);
  }
  Dashboard(Data: any):Observable<any>
  {
    return this.http.post(this.DashboardAPi,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
}
