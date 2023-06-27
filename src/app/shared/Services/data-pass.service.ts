import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataPassService {
  private data = {};  
  constructor() { }
  public GetPageVlidation (value:any)
  {
    var Valid ;
    Valid = false
    var list = JSON.parse(localStorage.getItem('PageDetails') || "")
   for (let entry1 of list) {
    
    for (let entry2 of entry1.page_detail) {
      if (entry2.page_url == value)
      {
        Valid = true
      }
      
    }

   }
    return Valid
  }

  setOption(value) {      
    this.data = value;  
  }  
  
  getOption() {  
    return this.data;  
  } 


}
