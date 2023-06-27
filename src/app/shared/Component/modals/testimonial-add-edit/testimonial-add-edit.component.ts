import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FileUploadService } from 'src/app/shared/Services/file-upload/file-upload.service';
import { TestimonialService } from 'src/app/shared/Services/testimonial.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-testimonial-add-edit',
  templateUrl: './testimonial-add-edit.component.html',
  styleUrls: ['./testimonial-add-edit.component.scss']
})
export class TestimonialAddEditComponent implements OnInit {

  testimonialForm: FormGroup;
  myControl1 = new FormControl();
  showLoader: boolean = false

  @Input() flag: any;
  @Input() data: any;
  sub: Subscription = new Subscription();

  subLobData = [{ lob_name: 'Buses' }, { lob_name: 'Icv Trucks' }, { lob_name: 'SCV Pickups' }]
  PplData = []
  lobData = []
  ApplicationData = []
  ModelData = []
  Model = []

  RoleTypeDisabled: boolean;
  isApprove: boolean;
  btnSave: boolean;
  btnUpdate: boolean;
  datas: any;
  TestimonialType: any;
  VideoType: any;
  DisplayVideIframe: boolean = false;
  public safeURL: SafeResourceUrl;
  public YoutubesafeURL: SafeResourceUrl;
  url;
  url1;
  Edit: any;
  CheckedLable: string;
  checked;
  imageURL: string;
  filterValue2: any;
  myfilename: string = '';
  selectedFile: File;
  format
  isfilechange: any = 'No'

  constructor(private fb: FormBuilder, private testimonialservice: TestimonialService,
    private modalService: NgbModal, private _sanitizer: DomSanitizer, private fileupload: FileUploadService) { }

  ngOnInit(): void {
    this.RoleTypeDisabled = false;
    this.isApprove = false;
    this.datas = this.data
    if (this.datas.id == '' || this.datas.id == undefined || this.datas.id == null) {
      this.btnSave = true;
      this.btnUpdate = false;
      this.buildItemForm('');
      this.VideoType = 'youtube'
    } else {
      this.buildItemForm(this.datas);
      this.editTestimonial(this.datas);
      this.btnSave = false;
      this.btnUpdate = true;
      this.RoleTypeDisabled = true;
      this.TestimonialType = 'VIDEO BASED';
      if (this.datas.yt_url) {
        this.VideoType = 'youtube';
        this.testimonialForm.get('VideoType').setValue(this.VideoType);
        this.DisplayVideIframe = true;
        const videoId = this.getId(this.datas.yt_url);
        this.YoutubesafeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
      }
      else if (this.datas.video_url) {
        this.DisplayVideIframe = false;
        this.VideoType = 'file';
        this.testimonialForm.get('VideoType').setValue(this.VideoType);
        this.url = this.datas.video_url;
        this.Edit = 'Yes';
        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.datas.video_url);
      }
      else {
        this.VideoType = 'youtube';
      }
    }
  }

  buildItemForm(item) {
    this.checked = false;
    this.CheckedLable = "Inactive";
    if (item.is_active == true) {
      this.CheckedLable = 'Active';
    }
    else {
      this.CheckedLable = "Inactive";
    }

    this.testimonialForm = this.fb.group({
      id: [item.id ? item.id : '',],
      name: [item.name || '', Validators.required],
      designation: [item.designation || '', Validators.required],
      description: [item.description || '', Validators.required],
      testimonial_id: [item.id || ''],
      model: [item.model || ''],
      testimonial_type: [item.type_of_testimonial || ''],
      yt_url: [item.yt_url || ''],
      sub_lob: [item.sub_lob || ''],
      lob_type: [''],
      ppl_type: [''],
      application: [item.application || ''],
      user_image: [item.image_url || ''],
      VideoType: [],
    });
    this.imageURL = item.image_url;

    // web_url:
    if (item.model) {
      this.myControl1.setValue(item.model)
      this.filterValue2 = item.model;
    }
  }

  OnchageVideoType(value) {
    this.url = '';
    this.VideoType = value.target.value;
  }

  editTestimonial(datas) {
    if (datas.sub_lob) {
      setTimeout(() => {
        this.GetLob(datas.sub_lob, true, datas);
      }, 1000);

    }
  }

  getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }

  goBack() {
    this.modalService.dismissAll()
  }

  GetPpl(lob_name, isEdit?, datas?) {
    this.testimonialForm.patchValue({ "ppl_type": "" })
    this.testimonialForm.patchValue({ "model": "" })
    if (this.btnUpdate) {
      var json = {
        "lob_name": lob_name,
        "action_type": 'db'
      }
    } else {
      var json = {
        "lob_name": lob_name.lob,
        'action_type': 'db'
      }
    }
    this.lobData = lob_name?.lob;
    this.testimonialservice.GetPplList(json).subscribe(response => {
      if (response.success) {
        this.PplData = response.data.ppl;

        if (isEdit && datas.ppl) {

          let ppl = this.PplData.filter(l => l.replace(" - ", "-").replace("- ", "-").replace(" -", "-").replace(/\s/g, "-").toLowerCase() == datas.ppl)
          if (ppl && ppl.length > 0) {

            this.testimonialForm.patchValue({
              "ppl_type": ppl[0]
            })
            this.getModelData(ppl[0], lob_name, true)

          }
        }
      }
      else {
        this.PplData = [];
      }
    }, () => {

    });
  }

  GetLob(sub_lob_name, isEdit?, datas?) {
    this.testimonialForm.patchValue({ "lob_type": "" })
    this.testimonialservice.GetLobList({ sub_lob_name: sub_lob_name?.lob_name }).subscribe(response => {
      if (response.success) {
        this.lobData = response.data
        if (isEdit && datas.lob) {
          let lob = this.lobData.filter(l => l.lob.replace(/\s/g, "-").toLowerCase() == datas.lob)
          if (lob && lob.length > 0) {
            this.testimonialForm.patchValue({
              "lob_type": lob[0]['lob']
            })
            this.GetPpl(lob[0]['lob'], true, datas);
          }
        }
      }
      else {
        this.lobData = []
      }
    }, () => {
    });
    this.GetApplication(sub_lob_name, isEdit, datas);
  }

  GetApplication(sub_lob_name, isEdit?, datas?) {
    if (this.btnUpdate) {
      var json = {
        "sub_lob": sub_lob_name
      }
    } else {
      var json = {
        "sub_lob": sub_lob_name.lob_name
      }
    }

    this.sub.add(this.testimonialservice.GetApplicationList(json).subscribe(response => {
      if (response.success) {
        this.ApplicationData = response.data;
        if (isEdit) {
          this.testimonialForm.patchValue({
            "application": datas.application
          })
        }
      }
      else {
        this.ApplicationData = []
      }
    }, () => { }))
  }

  getModelData(ppl_name, lob?, edit?) {
    this.testimonialForm.patchValue({ "model": "" })

    let modelPayload;
    if (edit) {
      modelPayload = {
        ppl: ppl_name,
        lob: lob
      }
      this.testimonialForm.patchValue({ "model": this.datas.model })
    }
    else {
      modelPayload = {
        ppl: ppl_name,
        lob: this.lobData
      }
    }
    this.sub.add(this.testimonialservice.GetModelList(modelPayload).subscribe(
      data => {
        if (data.success == true) {
          this.ModelData = [];
          this.ModelData = data.data.models;
          for (let entry1 of this.Model) {
            var json = { "key": entry1, "value": entry1 }
            this.Model.push(json);
          }
        }
        else {
          this.ModelData = [];
        }
      }, () => {
      }));
    if (edit) {
      let model = this.datas.model;
      this.testimonialForm.patchValue({
        "model": model
      })
    }
  }

  onSelectImagefile(event: any) {
    this.myfilename = '';
    this.selectedFile = <File>event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var size = event.target.files[0].size;
      var AcSize = Math.round(size / 1024);
      var Extension = event.target.files[0].name.substring(
        event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
      if (Extension == 'PNG' || Extension == 'JPG' || Extension == 'jpg' || Extension == 'png') {
        const reader = new FileReader();
        const file = event.target.files[0];
        this.selectedFile = file;
        if (AcSize < 50) {
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
            }
            this.imageURL = reader.result as string;
            this.testimonialForm.patchValue({
              fileSource: reader.result,
              this: this.myfilename += file.name
            });
          }
        }
        else {
          this.imageURL = ''
          Swal.fire('Oops...', 'Upload only 50 KB size files!', 'error')
        }
      }
      else {
        this.imageURL = ''
        Swal.fire('Oops...', 'only allows file types of  PNG, JPG ', 'error')
      }
    }
  }

  Filechange: any;
  onSelectFile(event) {
    const file = event.target.files && event.target.files[0];
    var size = event.target.files[0].size;
    if (size > 5000000) {
      event.target.value = '';
      Swal.fire('Upload only 5 MB size files!')
      return
    }
    if (file.type.indexOf('video') != 0) {
      event.target.value = '';
      Swal.fire('Upload only video files!')
      return

    }
    this.isfilechange = 'Yes'
    this.Edit = 'No'
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      const file1 = event.target.files[0];
      this.url = file1;
      reader.onload = (event) => {
        this.url1 = (<FileReader>event.target).result;
      }
    }
  }


  saveAndUpdate(value) {
    if (this.testimonialForm.invalid) {
      Swal.fire('Please fill all Mandatory Details');
      return;
    }

    let lobname = this.testimonialForm.value.lob_type.replace(/\s/g, "-").toLowerCase();
    let ppl = this.testimonialForm.value.ppl_type.replace(" - ", "-").replace("- ", "-").replace(" -", "-").replace(/\s/g, "-").toLowerCase();
    // this.itemForm.get('model').setValue(this.filterValue2);   
    let model = this.testimonialForm.value.model;
    const FormData1 = new FormData();

    if (value == 'edit') {
      FormData1.append("testimonial_id", this.testimonialForm.value.id);
    }

    FormData1.append("name", this.testimonialForm.value.name);
    FormData1.append("designation", this.testimonialForm.value.designation);
    FormData1.append("image_file", this.selectedFile ? this.selectedFile : "");
    FormData1.append("application", this.testimonialForm.value.application);
    FormData1.append("action_type", value);
    FormData1.append("lob", lobname ? lobname : this.datas.lob != undefined ? this.datas.lob : "");
    FormData1.append("ppl", ppl ? ppl : this.datas.ppl != undefined ? this.datas.ppl : "");
    FormData1.append("model", model ? model : this.datas.model != undefined ? this.datas.model : "");
    FormData1.append("testimonial_type", '');
    FormData1.append("description", this.testimonialForm.value.description);
    FormData1.append("yt_url", this.VideoType == 'youtube' ? this.testimonialForm.value.yt_url : "");
    FormData1.append("video_file", this.url != undefined ? this.url : "");
    FormData1.append("sub_lob", this.testimonialForm.value.sub_lob);

    this.showLoader = true
    this.sub.add(this.fileupload.uploadTestimonailData(FormData1).subscribe(data => {
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
            this.testimonialForm.reset()
            this.showLoader = false
            this.modalService.dismissAll()
          }
          else {
            this.testimonialForm.reset()
            this.showLoader = false
            this.modalService.dismissAll()
          }
        });
      }
      else {
        Swal.fire('UnSuccessfully saved! ' + data.data.msg);
        this.showLoader = false
      }
    },
    ));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
