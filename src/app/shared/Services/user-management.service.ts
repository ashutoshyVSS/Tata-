import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  
  private roleListURL = `${environment.baseUrl}/api/v1/cv_online/admin/role_List/`;
  private getPostionListURL = `${environment.baseUrl}/api/v1/cv_online/admin/position_list/`;
  private positionInsertUpdateURL = `${environment.baseUrl}/api/v1/cv_online/admin/InsertUpdatePositionMaster/`;
  private getBannerURL= `${environment.baseUrl}/api/v1/cv_online/admin/banner/`;
  private getPagemasterDataURL = `${environment.baseUrl}/api/v1/cv_online/list/RolePageMappingList/`;
  private insertPageMappingURL = `${environment.baseUrl}/api/v1/cv_online/list/UpdateRoleMapping/`;
  private registrationListURL= `${environment.baseUrl}/api/v1/cv_online/admin/registered_list/`;
  private registrationSaveURL= `${environment.baseUrl}/api/v1/cv_online/admin/registration/`;
  private registrationUpdateUrl = `${environment.baseUrl}/api/v1/cv_online/admin/update_account/`;
  private getTagUrl = `${environment.baseUrl}/api/v1/cv_online/get_tags/`;

  constructor(private http: HttpClient) { }

  getRole(Data: any):Observable<any>{
    return this.http.post(this.roleListURL,'', this.options).pipe(catchError(err => of(err)));
  }

  getPostionList(Data: any):Observable<any>{
    return this.http.post(this.getPostionListURL,Data, this.options).pipe(catchError(err => of(err)));
  }

  positionInsertUpdate(Data: any):Observable<any>{
    return this.http.post(this.positionInsertUpdateURL,Data,this.options).pipe(catchError(err => of(err)));
  }

  getBannerList(data:any): Observable<any> {
    let queryParams = new HttpParams()
    .set('is_active', data.is_active)
    .set('from_date', data.from_date)
    .set('to_date', data.to_date)
    .set('priority', data.priority)
    .set("offset", data.offset)
    .set("size", data.size)
    .set("sub_lob", data.sub_lob)
    .set("lob", data.lob)
    .set("page", data.page);
    return this.http.get<any>(this.getBannerURL, { params: queryParams }).pipe(catchError(this.handlError))
  }

  getPagemasterData(Data: any):Observable<any>{
    return this.http.post(this.getPagemasterDataURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  insertPageMapping(Data: any):Observable<any>{
    return this.http.post(this.insertPageMappingURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  registrationList(Data: any):Observable<any>{
    return this.http.post(this.registrationListURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  registrationSave(Data: any):Observable<any>{
    return this.http.post(this.registrationSaveURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  registrationUpdate(Data: any):Observable<any>{
    return this.http.post(this.registrationUpdateUrl,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  getTag(){
    return this.http.post(this.getTagUrl, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
  uploadHotspotJSON(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/v2/cv_online/add_feature/`, data).pipe(catchError(this.handlError));
  }

  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }
}
