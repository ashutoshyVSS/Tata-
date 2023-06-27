import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestimonialService } from 'src/app/shared/Services/testimonial.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/shared/Services/file-upload/file-upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-banner-details',
  templateUrl: './banner-details.component.html',
  styleUrls: ['./banner-details.component.scss']
})
export class BannerDetailsComponent implements OnInit {

  @Input() data: any;
  @Input() ispageType: any;
  sub: Subscription = new Subscription();

  bannerForm: FormGroup;
  showLoader: boolean = false

  bannerPriority = [
    { name: "1th Priority", value: "1" },
    { name: "2nd Priority", value: "2" },
    { name: "3rd Priority", value: "3" },
    { name: "4th Priority", value: "4" },
    { name: "5th Priority", value: "5" },
    { name: "6th Priority", value: "6" },
  ]

  myfilename: string = '';
  selectedFile: File;
  imageURL: string;
  pageType: any;
  url: any;
  safeURL: any;

  btnLabel: any;

  SubLobData = [
    { lob_name: 'Buses' }, { lob_name: 'Icv Trucks' }, { lob_name: 'SCV Pickups' }
  ]
  lobData: any;
  datas: any;
  isEdit: boolean = false;
  removeImg: boolean = false;

  minDate: any;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private testimonialservice: TestimonialService,
    private _sanitizer: DomSanitizer, private FileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.bannerBuildForm('')
    this.datas = this.data
    this.minDate = moment(new Date()).format('yyyy-MM-DD')
    if (this.datas.id == '' || this.datas.id == undefined || this.datas.id == null) {
      this.bannerBuildForm('')
      this.pageType = this.ispageType
      this.btnLabel = 'Submit'
      this.isEdit = false;
    }
    else {
      this.btnLabel = 'Update'
      this.isEdit = true;
      let lob;
      for (let i = 0; i < this.SubLobData.length; i++) {
        var sublob = (this.SubLobData[i].lob_name).toUpperCase();
        if (sublob == (this.datas.sub_lob.replace('-',' ').toUpperCase())) {
          lob = this.SubLobData[i];
        }
      }
      this.GetLob(lob);
      if(this.datas.page == 'HOME'){
        this.pageType = 'HOME'
       }
       else if(this.datas.page == 'EXPLORE'){
         this.pageType = 'EXPLORE'
       }
       else{
         this.pageType = 'FINANCE'
       }
      setTimeout(() => { this.bannerBuildForm(this.datas) }, 1000
      );
      if (this.datas.path_url) {
        this.url = this.datas.path_url;
        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.url)
      }
    }
  }

  bannerBuildForm(item) {
    if (item.sub_lob) {
      item.sub_lob = (item.sub_lob).replace("-", " ").toUpperCase();
      for (let i = 0; i < this.SubLobData.length; i++) {
        var sublob = (this.SubLobData[i].lob_name).toUpperCase();
        if (sublob == item.sub_lob) {
          item.sub_lob = this.SubLobData[i].lob_name;
        }
      }

      item.lob = item.lob.replace("-", " ").toUpperCase();
      for (let i = 0; i < this.lobData.length; i++) {
        var lob = (this.lobData[i].lob).toUpperCase();
        if (lob == item.lob) {
          item.lob = this.lobData[i].lob;
        }
      }
    }
    this.bannerForm = this.fb.group({
      title: [item.title || '', Validators.required],
      imgname: [item.bimg || '', !this.isEdit ? Validators.required : []],
      // this.btnSave ? Validators.required : []
      from_date: [moment(item.from_date).format("yyyy-MM-DD") || '', Validators.required],
      to_date: [moment(item.end_date).format("yyyy-MM-DD") || '', Validators.required],
      priority: [item.priority || ''],
      pages: [item.page || ''],
      sub_lob: [item.sub_lob || ''],
      lob_type: [item.lob || ''],
      bannerlink: [item.banner_link || ''],
    });
  }

  pageCheck(page) {
    this.pageType = page
  }

  goBack() {
    this.modalService.dismissAll()
  }

  onSelectImagefile(event: any) {
    this.myfilename = '';
    this.selectedFile = <File>event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var name = event.target.files[0].name
      var size = event.target.files[0].size;
      var AcSize = Math.round(size / 1024);
      var Extension = event.target.files[0].name.substring(
        event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
      if (Extension == 'PNG' || Extension == 'JPG' || Extension == 'jpg' || Extension == 'png' || Extension == 'webp' || Extension == 'WEBP') {
        const reader = new FileReader();
        const file = event.target.files[0];
        this.selectedFile = file;
        if (AcSize < 300) {
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = (test: any) => {
              const width = img.width;
              const height = img.height;
              if ((width !== 1920 && height !== 569) || (width > 1920 || height > 569)) {
                img.src = ''
                this.imageURL = ''
                this.bannerForm.patchValue({ "imgname": "" })
                Swal.fire('Oops...', 'Upload only 1920 x 569  size files!', 'error')
                return test;
              }
            }
            this.imageURL = reader.result as string;
            this.bannerForm.patchValue({
              fileSource: reader.result,
              this: this.myfilename += file.name
            });
          }
        }
        else {
          this.imageURL = ''
          Swal.fire('Oops...', 'Upload only 300 KB size files!', 'error')
        }
      }
      else {
        this.imageURL = ''
        Swal.fire('Oops...', 'only allows file types of  PNG, JPG, WEBP', 'error')
      }
    }
  }

  removeImage(type: any) {
    if (type == 'Upadate') {
      this.safeURL = null;
      this.removeImg = true;
    }
    else {
      this.selectedFile = null;
      this.imageURL = "";
      this.myfilename = "";
    }
  }

  OnchagePageType(value) {
    this.pageType = value.target.value;

    if (this.pageType == 'EXPLORE') {
      const sub_lob = this.bannerForm.get("sub_lob");
      const lob_type = this.bannerForm.get("lob_type");
      sub_lob.setValidators([Validators.required]);
      lob_type.setValidators([Validators.required]);
      sub_lob.updateValueAndValidity();
      lob_type.updateValueAndValidity();
    }
  }

  GetLob(sub_lob_name) {
    // this.bannerForm.patchValue({ "lob_type": "" })
    try {
      this.sub.add(this.testimonialservice.GetLobList({ sub_lob_name: sub_lob_name?.lob_name }).subscribe(response => {
        if (response.success) {
          this.lobData = response.data
        }
        else {
          this.lobData = []
        }
      }, () => {
      }));
    } catch (error) {
      this.showLoader = false
    }
  }

  public findInvalidControlsDeal() {
    const invalid = [];
    const controls = this.bannerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  saveAndUpdate(action) {
    var controls = this.findInvalidControlsDeal()
    if (this.bannerForm.invalid) {
      Swal.fire('Please fill all mandatory fields');
      return;
    }
    if ((this.bannerForm.value.from_date !== null && this.bannerForm.value.to_date !== null) && (this.bannerForm.value.from_date > this.bannerForm.value.to_date)) {
      Swal.fire('To Date should be greater than From Date');
      return
    }
    else if ((this.bannerForm.value.from_date !== null && this.bannerForm.value.to_date !== null) && (this.bannerForm.value.from_date === this.bannerForm.value.to_date)) {
      Swal.fire('From Date & To Date should not be same');
      return;
    }
    else if (this.bannerForm.value.from_date && !this.bannerForm.value.to_date) {
      Swal.fire('To date is required');
      return;
    } else if (!this.bannerForm.value.from_date && this.bannerForm.value.to_date) {
      Swal.fire('From date is required');
      return;
    }
    try {
      let lobname = this.bannerForm.value.lob_type.replace(/\s/g, "-").toLowerCase();
      let sub_lob = this.bannerForm.value.sub_lob.replace(/\s/g, "-").toLowerCase();
      const data = new FormData();
      if (this.datas.id) {
        data.append("id", this.datas.id.toString());
      }
      data.append("title", this.bannerForm.value.title);
      data.append('bimg', this.selectedFile ? this.selectedFile : "");
      data.append('from_date', this.bannerForm.value.from_date == null || this.bannerForm.value.from_date == '' ? '' : moment(this.bannerForm.value.from_date).format('yyyy-MM-DD  05:30:01'));//timing is 05:30:01 becoz to match backend UTC timing 00:00:01
      data.append('to_date', this.bannerForm.value.to_date == null || this.bannerForm.value.to_date == '' ? '' : moment(this.bannerForm.value.to_date).format('yyyy-MM-DD  05:30:01'));//timing is 05:30:01 becoz to match backend UTC timing 00:00:01
      data.append('page',this.pageType);
      data.append('priority', this.bannerForm.value.priority == null || this.bannerForm.value.priority == '' ? '' : this.bannerForm.value.priority);
      data.append('lob', lobname);
      data.append('sub_lob', sub_lob);
      data.append('bannerlink', this.bannerForm.value.bannerlink == null || this.bannerForm.value.bannerlink == '' ? '' : this.bannerForm.value.bannerlink);

      this.showLoader = true
      if(!this.isEdit){
        this.sub.add(this.FileUploadService.uploadBanner(data).subscribe((data) => {
          this.showLoader = false
          if (data.success) {
            this.showLoader = false
            Swal.fire({
              title: data.data.msg,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.bannerForm.reset()
                this.showLoader = false
                this.modalService.dismissAll()
              }
              else {
                this.bannerForm.reset()
                this.showLoader = false
                this.modalService.dismissAll()
              }
            })
          }
          else {
            this.showLoader = false
            Swal.fire(data.data.msg)
            return
          }
        },
          (error) => {
            this.showLoader = false
            Swal.fire(error.error.data.msg)
          }
        ));
      }
      else{
        this.sub.add(this.FileUploadService.uploadEditBanner(data).subscribe((data) => {
          this.showLoader = false
          if (data.success) {
            this.showLoader = false
            Swal.fire({
              title: data.data.msg,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.bannerForm.reset()
                this.showLoader = false
                this.modalService.dismissAll()
              }
              else {
                this.bannerForm.reset()
                this.showLoader = false
                this.modalService.dismissAll()
              }
            })
          }
          else {
            this.showLoader = false
            Swal.fire(data.data.msg)
            return
          }
        },
          (error) => {
            this.showLoader = false
            Swal.fire(error.error.data.msg)
          }
        ));
      }
      
    } catch (error) {
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
