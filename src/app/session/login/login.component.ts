import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { SetTitleService } from 'src/app/shared/Services/set-title.service';
import { AuthorizeService } from './../../shared/Services/authorize.service';
import { CommonService } from './../../shared/Services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  sub: Subscription = new Subscription();
  loginData: any;
  submitted = false;
  showLoader: boolean = false
  page_listNew = [
    {
      "page_master_id": 1,
      "HeaderSequence": 1,
      "MenuHeaderName": "Dashboard",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": []
    },
    {
      "page_master_id": 4,
      "HeaderSequence": 4,
      "MenuHeaderName": "Vehicle",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 7,
          "page_display_name": "Vehicle List",
          "page_url": "InventoryList",
          "icon": null,
          "tooltip": null
        }
      ]
    },
    {
      "page_master_id": 10,
      "HeaderSequence": 10,
      "MenuHeaderName": "Lead Details",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 20,
          "page_display_name": "FAQ List",
          "page_url": "FAQList",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 19,
          "page_display_name": "Test Drive List",
          "page_url": "TestDriveList",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 17,
          "page_display_name": "Call Back List",
          "page_url": "CallBackList",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 12,
          "page_display_name": "Customer List",
          "page_url": "CustomerList",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 13,
          "page_display_name": "Lead List",
          "page_url": "LeadList",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 18,
          "page_display_name": "Referral Sources",
          "page_url": "SourceMaster",
          "icon": null,
          "tooltip": null
        }
      ]
    },
    {
      "page_master_id": 9,
      "HeaderSequence": 9,
      "MenuHeaderName": "User Management",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        // {
        //     "page_detail_id": 21,
        //     "page_display_name": "Banner Upload",
        //     "page_url": "BannerUpload",
        //     "icon": null,
        //     "tooltip": null
        // },
        {
          "page_detail_id": 9,
          "page_display_name": "Position Master",
          "page_url": "Positionmaster",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 10,
          "page_display_name": "Access Management",
          "page_url": "RolePageMapping",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 23,
          "page_display_name": "Blog List",
          "page_url": "BlogList",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 1,
          "page_display_name": "Registration List",
          "page_url": "RegistrationList",
          "icon": null,
          "tooltip": null
        }
      ]
    },
    {
      "page_master_id": 11,
      "HeaderSequence": 11,
      "MenuHeaderName": "Feedback & Reviews",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 15,
          "page_display_name": "Feedback List",
          "page_url": "FeedBackList",
          "icon": null,
          "tooltip": null
        }
      ]
    },
    {
      "page_master_id": 12,
      "HeaderSequence": 12,
      "MenuHeaderName": "Testimonial",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 16,
          "page_display_name": "Testimonial List",
          "page_url": "TestimonialList",
          "icon": null,
          "tooltip": null
        }
      ]
    },
    {
      "page_master_id": 13,
      "HeaderSequence": 13,
      "MenuHeaderName": "Configuration",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "Feature",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 17,
          "page_display_name": "Feature List",
          "page_url": "FeatureList",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 18,
          "page_display_name": "Hotspot List",
          "page_url": "HotspotList",
          "icon": null,
          "tooltip": null
        },
        {
          "page_detail_id": 21,
          "page_display_name": "Banner Upload",
          "page_url": "BannerUpload",
          "icon": null,
          "tooltip": null
        },
      ]
    },
    //   {
    //     "page_master_id": 14,
    //     "HeaderSequence": 14,
    //     "MenuHeaderName": "Hotspot",
    //     "icon": "dashboard",
    //     "page_url": "",
    //     "tooltip": "Hotspot",
    //     "type": "link",
    //     "page_detail": [
    //         {
    //             "page_detail_id": 15,
    //             "page_display_name": "Hotspot List",
    //             "page_url": "HotspotList",
    //             "icon": null,
    //             "tooltip": null
    //         }
    //     ]
    // },
  ]

  constructor(private fb: FormBuilder,
    private _renderer: Renderer2, private CommonService: CommonService,
    private datepipe: DatePipe, private AuthService: AuthorizeService,
    private router: Router, private SetTitleService: SetTitleService,
  ) {
    this._renderer.removeStyle(document.body, 'margin-top');
    // let body = document.getElementsByTagName('body')[0];
    // body.classList.remove("mat-typography");
    document.body.classList.add("Mybody");
  }
  ToDate: any;
  FromDate: any;
  signupForm!: FormGroup;
  FinalMenu: any = []
  ngOnInit(): void {
    this.SetTitleService.updateTitle('CV-OSP Admin | Login')
    localStorage.setItem('token', '')
    localStorage.setItem('loginData', '');
    localStorage.setItem('PageDetails', '');
    localStorage.setItem('tab', '');
    localStorage.setItem('subMenu', '')
    localStorage.setItem('ORGName', '');
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("login-page");
    this.signupForm = this.fb.group(
      {
        username: ["", Validators.required],
        password: ["", Validators.required],
      }
    );
  }

  onSubmit() {
    try {
      this.submitted = true;
      this.FinalMenu = [];
      if (this.signupForm.valid) {
        var skey = "edp@$3#drishti"
        var salt = "dRishtI";
        var iterations = 128;
        var bytes = CryptoJS.PBKDF2(skey, salt, { keySize: 48, iterations: iterations });
        var iv = CryptoJS.enc.Hex.parse(bytes.toString().slice(0, 32));
        var key = CryptoJS.enc.Hex.parse(bytes.toString().slice(32, 96));
        var cipherpassword = CryptoJS.AES.encrypt(this.signupForm.value.password, key, { iv: iv }).toString();
        //  var cipherpassword = CryptoJS.AES.encrypt(this.signupForm.value.password, key, { iv: iv }).toString();
        var json = {
          username: this.signupForm.value.username,
          password: cipherpassword,
        }

        this.showLoader = true;
        this.sub.add(this.AuthService.loginAuth(json).subscribe({
          next: (data: any) => {
            if (data.success == true) {
              this.showLoader = false;
              this.submitted = false;
              this.setSession(data);
              this.router.navigate(['pages/Dashboard']);
            }
            else {
              this.showLoader = false;
              this.submitted = false;
              Swal.fire('Oops...', data.data.msg, 'error')
            }
          },
          error: () => {
            alert('SORRY! Service is currently unavailable. Please Try again after some time.')
            this.showLoader = false;
            this.submitted = false;
           },
          complete: () => { }
        }))
        // this.sub.add(this.AuthService.loginAuth(json).subscribe(
        //   (data: any) => {
        //     console.log(data);
            
        //     if (data.success == true) {
        //       this.showLoader = false;
        //       this.submitted = false;
        //       //  for (let dataq of data.data.page_list) {
        //       //   var pagedetailarray = []
        //       //   for (let datadetail of dataq?.page_detail) {
        //       //     var Pagedetail = {
        //       //       "page_detail_id": datadetail?.page_detail_id,
        //       //       "page_display_name": datadetail?.page_display_name,
        //       //       "page_url": datadetail?.page_url,
        //       //       "icon": null,
        //       //       "tooltip": null,
        //       //     }
        //       //     pagedetailarray.push(Pagedetail)
        //       //   }
        //       //   var json:any = {
        //       //     "page_master_id": dataq.page_master_id,
        //       //     "HeaderSequence": dataq.page_master_id,
        //       //     "MenuHeaderName": dataq.page_display_name,
        //       //     "icon": "dashboard",
        //       //     "page_url": "",
        //       //     "tooltip": "History",
        //       //     "type": "link",
        //       //     page_detail: pagedetailarray
        //       //   }
        //       //   this.FinalMenu.push(json)
        //       // }
        //       this.setSession(data);
        //       this.router.navigate(['pages/Dashboard']);
        //     }
        //     else {
        //       this.showLoader = false;
        //       this.submitted = false;
        //       Swal.fire('Oops...', data.data.msg, 'error')
        //     }
        //   }, (err: any) => {
        //     alert('SORRY! Service is currently unavailable. Please Try again after some time.')
        //     this.showLoader = false;
        //     this.submitted = false;
        //   }
        // ));
      }
    } catch (error) {
      console.log(error)
    }
  }

  setSession(data: any) {
    
    if(data.data.role_name != 'TML'){
      this.page_listNew = [
        {
          "page_master_id": 1,
          "HeaderSequence": 1,
          "MenuHeaderName": "Dashboard",
          "icon": "dashboard",
          "page_url": "",
          "tooltip": "History",
          "type": "link",
          "page_detail": []
        },
        {
          "page_master_id": 10,
          "HeaderSequence": 10,
          "MenuHeaderName": "Lead Details",
          "icon": "dashboard",
          "page_url": "",
          "tooltip": "History",
          "type": "link",
          "page_detail": [
            {
              "page_detail_id": 19,
              "page_display_name": "Test Drive List",
              "page_url": "TestDriveList",
              "icon": null,
              "tooltip": null
            },
            {
              "page_detail_id": 13,
              "page_display_name": "Lead List",
              "page_url": "LeadList",
              "icon": null,
              "tooltip": null
            }
          ]
        }
      ]
    }
    localStorage.setItem('token', data.data.token.access_token);

    localStorage.setItem('loginData', JSON.stringify(data.data));
    localStorage.setItem('PageDetails', JSON.stringify(this.page_listNew)); //static
    //  localStorage.setItem('PageDetails', JSON.stringify(this.FinalMenu)); //dynamic
    let pageDetailData = JSON.parse(localStorage.getItem('PageDetails') || '');
    let tabDetail = pageDetailData.find((e: any) => e?.MenuHeaderName == 'Dashboard')
    localStorage.setItem('tab', tabDetail?.page_master_id);
    this.CommonService.tabValue.next(tabDetail?.page_master_id)
    localStorage.setItem('subMenu', tabDetail?.page_detail[0]?.page_detail_id ? tabDetail?.page_detail[0]?.page_detail_id : '')
    let Minutes = data.data.token.expires_in * 1000;
    let date1 = new Date();
    let date2 = new Date(date1.getTime() + Minutes);
    localStorage.setItem('timer', JSON.stringify(date2));

    var date = new Date();
    var d = new Date(date.getFullYear(), date.getMonth(), 1); // today!
    this.FromDate = this.datepipe.transform(d, 'yyyy-MM-dd')
    this.ToDate = this.datepipe.transform(date, 'yyyy-MM-dd')
    localStorage.setItem("ToDate", this.ToDate);
    localStorage.setItem("FromDate", this.FromDate);

  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("login-page");
    this.sub.unsubscribe();
  }
}
