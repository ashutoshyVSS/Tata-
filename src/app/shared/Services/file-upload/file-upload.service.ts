import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private uploadTestimonailDataURL = `${environment.baseUrl}/api/v1/cv_online/admin/add_testimonial/`;
  private UploadProductImagesUrl = `${environment.baseUrl}/api/v1/cv_online/upload_vehicle_images/`;
  private UploadvehiclecsvURL = `${environment.baseUrl}/api/v1/cv_online/admin/add_vehicle_csv/`;
  private uploadBulkVCImages = `${environment.baseUrl}/api/v1/cv_online/admin/bulk_images_upload/`;
  private UploadVideoUrl = `${environment.baseUrl}/api/v1/cv_online/admin/upload_video/`;
  private changeBannerStatusURL = `${environment.baseUrl}/api/v1/cv_online/admin/banner/`;
  private uploadBannerUrl = `${environment.baseUrl}/api/v1/cv_online/admin/banner/`;
  private UploadBlogUrl = `${environment.baseUrl}/api/v1/cv_online/admin/blog/`;
  private UploadBannerUrl = `${environment.baseUrl}/api/v1/cv_online/admin/banner/`;
  private UploadTataMitraBlogUrl = `${environment.baseUrl}/api/v2/cv_online/admin/blog/`;
  private UploadFeatureURL = `${environment.baseUrl}/api/v2/cv_online/bulk_insert_update_feature/`;
  private uploadBulkFeatureImages = `${environment.baseUrl}/api/v2/cv_online/upload_feature_images/`;
  private UploadHotspotImageUrl = `${environment.baseUrl}/api/v2/cv_online/insert_image/`;

  constructor(private http: HttpClient) { }

  uploadTestimonailData(data: FormData) {
    return this.http.post<any>(this.uploadTestimonailDataURL, data).pipe(catchError(this.handlError));
  }

  uploadImageDocument(data: FormData) {
    return this.http.post<any>(this.UploadProductImagesUrl, data).pipe(catchError(this.handlError));
  }
  uploadvehicleCSV(data: FormData) {
    return this.http.post<any>(this.UploadvehiclecsvURL, data).pipe(catchError(this.handlError));
  }
  UploadVideo(data: FormData) {
    return this.http.post<any>(this.UploadVideoUrl, data).pipe(catchError(this.handlError));
  }
  uploadBulkVCImage(data: FormData) {
    return this.http.post<any>(this.uploadBulkVCImages, data).pipe(catchError(this.handlError))
  }
  changeBannerStatus(id: number, status: string) {
    const data = new FormData();
    data.append('id', id.toString());  
    data.append("status", status);
   return this.http.put<any>(this.changeBannerStatusURL, data).pipe(catchError(this.handlError))
  }

  uploadBanner(data: FormData) {
    return this.http.post<any>(this.uploadBannerUrl, data).pipe(catchError(this.handlError));
  }

  uploadEditBanner(data: FormData) {
  return this.http.put<any>(this.uploadBannerUrl, data).pipe(catchError(this.handlError))
}

uploadBlog(data: FormData) {
  return this.http.post<any>(this.UploadBlogUrl, data).pipe(catchError(this.handlError));
}

uploadEditBlog(id, title, description, from_date, to_date, priority,page,bannerlink,sub_lob,lob , bimg) {

    const data = new FormData();
    data.append('id', id.toString());  
    data.append("title", title);
    data.append("description", description);
    data.append('bimg', bimg);
    data.append('from_date', from_date);
    data.append('to_date', to_date);
    data.append('page', page);
    data.append('priority', priority);
    data.append('lob', lob);
    data.append('sub_lob', sub_lob);
    data.append('bannerlink', bannerlink);
    
  return this.http.put<any>(this.UploadBannerUrl, data).pipe(catchError(this.handlError))
}

uploadTataMitraBlog(data: FormData) {
  return this.http.post<any>(this.UploadTataMitraBlogUrl, data).pipe(catchError(this.handlError));
}
uploadFeatureCSV(data: FormData) {
  return this.http.post<any>(this.UploadFeatureURL, data).pipe(catchError(this.handlError));
}
uploadBulkFeatureImageZip(data: FormData) {
  return this.http.post<any>(this.uploadBulkFeatureImages, data).pipe(catchError(this.handlError))
}

uploadHotspotImage(data: FormData) {
  return this.http.post<any>(this.UploadHotspotImageUrl, data).pipe(catchError(this.handlError));
}

  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }
}
