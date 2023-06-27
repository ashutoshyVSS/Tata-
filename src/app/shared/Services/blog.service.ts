import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { environment, } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private cvAdminUrlV1 = `${environment.baseUrl}/api/v1/cv_online/`;
  private cvAdminUrlV2 = `${environment.baseUrl}/api/v2/cv_online/`;

  readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  constructor(private http: HttpClient) { }
  getBlogList(offset:any,size:any,tag?:any,search_text?:any,type_of_blog?:any,blog_status?:any): Observable<any> {
    let data:any = {};
    data["tag"] = tag ? tag : "";
    data["type_of_blog"] = type_of_blog ? type_of_blog : "";
    data["search_text"] = search_text ? search_text :"";
    data["blog_status"] = blog_status ? blog_status : "";
    data["offset"] = offset;
    data["limit"] = size;
    return this.http.post(`${this.cvAdminUrlV1}get_blog_list/`, data, this.options).pipe(catchError((err:any) => of(err)));
  }

  tataMitraList(offset, size,tags? ,title? ,type? ,status?,priority?,type_of_blog?): Observable<any> {
   
    let data = {};
    data["tag"] = tags ? tags : "";
    // data["limit"] = size;
    data["type_of_blog"] = type_of_blog ? type_of_blog : "";
    data["search_text"] = title ? title :"";
    data["blog_status"] = status ? status : "";
    data["offset"] = offset;
    data["limit"] = size;
    data["priority"] = priority ? priority : '';
    data["type"] = type ? type : "";
   return this.http.post(`${this.cvAdminUrlV2}get_blog_list/`, data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));

  }
}
