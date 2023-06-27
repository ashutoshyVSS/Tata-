import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onActivate(event:any) {
    var scrollElem:any= document.querySelector('#moveTop') || null;
   scrollElem.scrollIntoView(); 
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
  }, 16);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
    
}
}
