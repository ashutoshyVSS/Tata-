import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private feedbackListUrl = `${environment.baseUrl}/api/v1/cv_online/feedback_list/`;
  private ApproveRejectFeedbakURL = `${environment.baseUrl}/api/v1/cv_online/admin/feedback_approve/ `;

  constructor(private http: HttpClient) { }

  feedbackList(data: any): Observable<any> {
    return this.http.post<any>(this.feedbackListUrl, data, this.options).pipe(catchError(this.handlError));
  }

  ApproveRejectFeedbak(data: any): Observable<any> {
    return this.http.post<any>(this.ApproveRejectFeedbakURL, data, this.options).pipe(catchError(this.handlError));
  }

  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }
}
