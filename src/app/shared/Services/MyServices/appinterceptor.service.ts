import { Injectable } from '@angular/core';
import { HttpInterceptor,HttpRequest,HttpHandler,HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {AuthorizeService} from '../../Services/authorize.service'
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
// import {MatSnackBar}  from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class AppinterceptorService implements HttpInterceptor {

  constructor(private auth: AuthorizeService) { }
  handlError(error:HttpErrorResponse)
  {
    return throwError(() => error)
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    
    const headers= new HttpHeaders(
      {
        Authorization: `Bearer ${this.auth.getToken()}`,
        'Content-Type': `application/json`,
      }
    )
    const clone= req.clone({
      headers:headers
    })
    let self = this;
    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      //return Observable.throw(new HttpErrorResponse({ error: 'Internet is required.' }));
      //Swal.fire('Internet is required!')
      // self.snackBar.open('Internet is required.!', '', { duration: 3000 });
      Swal.fire('Internet is required.!');
      return throwError(() => 'Internet is required.' );
  } else {
   return next.handle(clone).pipe(
     catchError(error=>{
      if (error.status === 401 ) {
        this.auth.loggedOut();
        throw error;
      }
      else
      {
        throw error;
      }
     })
   );

    }

  }
}

@Injectable({
  providedIn: 'root'
})
export class FileAppinterceptorService implements HttpInterceptor {

  constructor(private auth: AuthorizeService ,) { }
  handlError(error:HttpErrorResponse)
  {
    return throwError(() => error)
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    // alert ('hi');
    const headers= new HttpHeaders(
      {
        Authorization: `Bearer ${this.auth.getToken()}`,
       // 'Content-Type': `application/x-www-form-urlencoded`, 

        }
    )
    const clone= req.clone({
      headers:headers
    })

    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      //return Observable.throw(new HttpErrorResponse({ error: 'Internet is required.' }));
      Swal.fire('Internet is required!')
      return throwError(() => 'Internet is required.' );
  } else {

   return next.handle(clone).pipe(
     catchError(error=>{
      if (error.status === 401 ) {
        this.auth.loggedOut();
        throw error;
      }
      else
      {
        throw error;
      }
     })
   );
    }


  }
}


