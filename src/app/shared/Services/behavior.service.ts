import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {

  public isFilterChanged = new BehaviorSubject<boolean>(false);

  constructor() {
    this.isFilterChanged = new BehaviorSubject<boolean>(false);
   }
}
