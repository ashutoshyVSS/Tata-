import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment, } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private cvAdminUrlV1 = `${environment.baseUrl}/api/v1/cv_online/`;
  private cvAdminUrlV2 = `${environment.baseUrl}/api/v2/cv_online/`;

  readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getVehicleList(data: any): Observable<any> {

    return this.http.post(`${this.cvAdminUrlV1}admin/get_vehicles_info/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }

  ApproveRejectVehicle(data:any):Observable<any>
  {
     return this.http.post<any>(`${this.cvAdminUrlV1}admin/approve_vehicle/`,data).pipe(catchError((err: any) => of(err)));
  }

  RemoveInventoryById(data:any):Observable<any>
  {
     return this.http.post<any>(`${this.cvAdminUrlV1}admin/remove_vehicle_image/`,data).pipe(catchError((err: any) => of(err)));
  }

  AddInventory(data:any):Observable<any>
  {
     return this.http.post<any>(`${this.cvAdminUrlV1}add_vehicle/`,data).pipe(catchError((err: any) => of(err)));
  }

  GetVCDetails(data:any):Observable<any>
  {
     return this.http.post<any>(`${this.cvAdminUrlV1}admin/find_vc/`,data).pipe(catchError((err: any) => of(err)));
  }

  Removespecificimage(data:any):Observable<any>{
     return this.http.post<any>(`${this.cvAdminUrlV1}admin/remove_vehicle_image/`,data).pipe(catchError((err: any) => of(err)));
  }

  updateVehicleList(data: any): Observable<any> {

    return this.http.post(`${this.cvAdminUrlV2}admin/update_product/`, data, this.options).pipe(catchError((err: any) => of(err)));
  }

  // uploadImageDocument(data: FormData) {
  //   return this.http.post<any>(`${this.cvAdminUrlV1}upload_vehicle_images/`, data).pipe(catchError((err: any) => of(err)));
  // }

  // UploadVideo(data: FormData) {
  //   return this.http.post<any>(`${this.cvAdminUrlV1}admin/upload_video/`, data).pipe(catchError(catchError((err: any) => of(err))));
  // }

  // uploadvehicleCSV(data: FormData) {
  //   return this.http.post<any>(`${this.cvAdminUrlV1}admin/add_vehicle_csv/`, data).pipe(catchError((err: any) => of(err)));
  // }

  // uploadBulkVCImage(data: FormData) {
  //   return this.http.post<any>(`${this.cvAdminUrlV1}admin/bulk_images_upload/`, data).pipe(catchError((err: any) => of(err)))
  // }
}
