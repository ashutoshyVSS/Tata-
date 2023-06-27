import { Injectable } from '@angular/core';
import { environment, } from '../../../environments/environment';
import {HttpClient,HttpParams, HttpErrorResponse} from '@angular/common/http'
import {Router} from '@angular/router';
import {Observable, throwError,of} from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  private LoginUrl = `${environment.baseUrl}/api/v1/cv_online/admin/login/`;
  constructor(private http: HttpClient, private _Router: Router) { }

//   loginAuth(data: any): Observable<any> {
//     //return this.http.post<any>(this.LoginUrl, data).pipe();
//     return this.http.post<any>(this.LoginUrl,data).pipe();
//  }
 loginAuth(data: any): Observable<any> {
  return this.http.post(this.LoginUrl,data ,  { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
}
  ExpireDateTime: any;
  loggedIn() {
    this.ExpireDateTime = JSON.parse((localStorage.getItem('timer')) || "");
    let date1 = new Date();
    let date2 = new Date(this.ExpireDateTime);
    if (date2 >= date1) {
      if (localStorage.getItem('token') && localStorage.getItem('token') != "null") {
        return true;
      }
      else {
        return false;
      }
    }
    else {
     // localStorage.clear();
   localStorage.removeItem('token');
    //localStorage.removeItem('loginData');
      return false;
    }
  }

  public getToken(): string {
    return (localStorage.getItem('token') || "");
  }
  loggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('loginData');
    localStorage.removeItem('PageDetails');
    localStorage.removeItem('ORGName');
    localStorage.removeItem('timer');
    localStorage.removeItem('FilterSet')
    localStorage.removeItem('isBackfalg')
    this._Router.navigate(['session/Login']);
  }

  handlError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
