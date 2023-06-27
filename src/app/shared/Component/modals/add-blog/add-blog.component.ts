import { Component, OnInit, EventEmitter, Output, Input, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/shared/Services/file-upload/file-upload.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent implements OnInit {
  public blogForm: FormGroup;
  @ViewChild('uploadFileInput', { static: false }) uploadFileInput: ElementRef;
  sub: Subscription = new Subscription();
  blogData: any;
  btnSave: boolean = false
  btnUpdate: boolean = false;
  submitted: boolean = false;
  pageType: any = 'IMAGE BASED';
  DisplayVideIframe: boolean = false;
  myfilename: string = '';
  imageURL: string;
  selectedFile: File;
  public safeURL: SafeResourceUrl;
  public safeauthorImageURL: SafeResourceUrl;
  // remove: boolean = false;
  // removeAuthorImage: boolean;
  ImageErrorString: any;
  myAuthorfilename: string = '';
  selectedAuthorFile: File;
  imageAuthorURL: string;
  isvalidyturl: boolean = false;
  public YoutubesafeURL: SafeResourceUrl;
  priorityData = [{ priority: 1 }, { priority: 2 }, { priority: 3 }, { priority: 4 }, { priority: 5 }];
  ckeConfig: any;
  @Input() data: any;
  @Input() flag: any;
  showLoader = false;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private _sanitizer: DomSanitizer, private datepipe: DatePipe, private fileUpService: FileUploadService) { }


  ngOnInit() {
    this.createblogForm('');
    this.blogData = this.data;
    this.ckeConfig = {
      removePlugins: 'maximize,save'
    };
    if (this.flag == 'add') {
      this.btnUpdate = false;
      this.btnSave = true;
      // this.createblogForm('');
    } else if (this.flag == 'update') {
      this.btnUpdate = true;
      this.btnSave = false;
      if (this.blogData.youtube_url) {
        this.pageType = 'VIDEO BASED';
        const videoId = this.getId(this.blogData.youtube_url);
        this.YoutubesafeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
        this.onBlurVideoUL(this.blogData.youtube_url);
      }
      if (this.blogData.image_path) {
        let url = this.blogData.image_path;
        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(url);
        if (this.safeURL) {
          this.imageURL = this.blogData.image_path;
        }
      }
      if (this.blogData.author_image) {
        let url = this.blogData.author_image;
        this.safeauthorImageURL = this._sanitizer.bypassSecurityTrustResourceUrl(url)
        if (this.safeauthorImageURL) {
          this.imageAuthorURL = this.blogData.author_image;
        }
      }
      // this.createblogForm('');
      setTimeout(() => { this.createblogForm(this.blogData) }, 1000);
    }
    console.log(this.pageType)
  }

  createblogForm(item) {
    console.log('item === ',item);
    
    this.blogForm = this.fb.group({
      action_type: [item ? "edit" : "add", Validators.required],
      title: [item.title ? item.title : "", Validators.required],
      description: [item.description ? item.description : "", Validators.required],
      tag: [item.tag ? item.tag : '', Validators.required],
      type_of_blog: [item.type_of_blog ? item.type_of_blog : 'IMAGE BASED', Validators.required],
      priority: [item.priority ? item.priority : ''],
      type: [item.type ? item.type : 'BLOG', Validators.required],
      youtube_url: [item.youtube_url ? item.youtube_url : ""],
      image_file: [item.image_path ? item.image_path : ''],
      author_name: [item.author_name ? item.author_name : '', Validators.required],
      author_image_file: [item.author_image ? item.author_image : ''],
      author_description: [item.author_description ? item.author_description : '', Validators.required],
    });
    this.pageType = this.blogForm.value.type_of_blog;
    this.OnchangePageType(this.blogForm.value.type_of_blog);
  }

  OnchangePageType(value) {
    this.pageType = value;
    if (value == 'VIDEO BASED') {
      this.blogForm.controls["image_file"].clearValidators();
      this.blogForm.controls["image_file"].updateValueAndValidity();
      this.blogForm.get('youtube_url').setValidators(Validators.required);
      this.blogForm.controls['youtube_url'].updateValueAndValidity();
      this.safeURL = null;
      this.blogForm.controls['image_file'].setValue('')
      this.selectedFile = null;
      this.imageURL = "";
      this.myfilename = "";
    }
    else {
      this.blogForm.controls["youtube_url"].clearValidators();
      this.blogForm.controls["youtube_url"].updateValueAndValidity();
      this.blogForm.get('image_file').setValidators(Validators.required);
      this.blogForm.controls['image_file'].updateValueAndValidity();
      this.blogForm.controls['youtube_url'].setValue('')
      this.DisplayVideIframe = false;
    }
  }

  onSelectImagefile(event: any, data?: any) {
    this.ImageErrorString = "";
    if (data) {
      this.myAuthorfilename = '';
      this.selectedAuthorFile = <File>event.target.files[0];
    }
    else {
      this.myfilename = '';

      this.selectedFile = <File>event.target.files[0];
    }
    if (event.target.files && event.target.files[0]) {
      var name = event.target.files[0].name
      var size = event.target.files[0].size;
      var AcSize = Math.round(size / 1024);
      var Extension = event.target.files[0].name.substring(
        event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();

      if (Extension == 'PNG' || Extension == 'JPG' || Extension == 'jpg' || Extension == 'png' || Extension == 'webp' || Extension == 'WEBP') {
        const reader = new FileReader();
        const file = event.target.files[0];
        if (data) {
          this.selectedAuthorFile = file;
        }
        else {
          this.selectedFile = file;
        }
        if (AcSize < 300) {
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
              const width = img.width;
              const height = img.height;
            }
            if (data) {
              this.imageAuthorURL = reader.result as string;
              this.blogForm.patchValue({
                fileSource: reader.result,
                this: this.myAuthorfilename += file.name

              });
            }
            else {

              this.imageURL = reader.result as string;
              this.blogForm.patchValue({
                fileSource: reader.result,
                this: this.myfilename += file.name

              });
            }

          }
        }

        else {
          this.imageURL = ''
          Swal.fire('Oops...', 'Upload only 300 KB size files!', 'error')
        }

      }
      else {
        this.imageURL = ''
        Swal.fire('Oops...', 'only allows file types of  PNG, JPG ', 'error')
      }
    }
  }

  removeImage(data?: any) {
    if (data) {
      this.selectedAuthorFile = null;
      this.imageAuthorURL = "";
      this.myAuthorfilename = "";
      if (this.safeauthorImageURL) {
        this.safeauthorImageURL = null;
        // this.removeAuthorImage = true;
        this.blogForm.controls['author_image_file'].setValue('')
      }
    }
    else {
      this.selectedFile = null;
      this.imageURL = "";
      this.myfilename = "";
      if (this.safeURL) {
        this.safeURL = null;
        // this.remove = true;
        this.blogForm.controls['image_file'].setValue('')
      }
    }
    (<HTMLInputElement>document.getElementById('uploadFileInput')).value = '';
  }
  onBlurVideoUL(event) {

    this.isvalidyturl = this.ValidateYoutubeUrl(event);
    if (event) {
      if (this.isvalidyturl != false) {
        this.DisplayVideIframe = true
        const videoId = this.getId(event);
        this.YoutubesafeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
      }
      else {
        this.DisplayVideIframe = false
        Swal.fire('Please Enter valid Youtube URL');
      }
    }
  }
  ValidateYoutubeUrl(url) {
    var regExp = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
    var match = url.match(regExp);
    return (match && match[1].length == 11) ? match[1] : false;
  }
  getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }

  omit_special_char(event) {
    if (event.target.selectionStart === 0 && event.code === "Space") {
      event.preventDefault();
      return false;
    } else {
      var k;
      k = event.charCode;
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
  }
  omit_space_at_start(event) {
    if (event.target.selectionStart === 0 && event.code === "Space") {
      event.preventDefault();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.blogForm.invalid) {
      Swal.fire('Please fill all mandatory fields');
      return;
    }
    else {
      if (this.flag == 'add') {
        this.addBlog('');
      } else if (this.flag == 'update') {
        this.addBlog(this.blogData);
      }
    }
  }

  addBlog(blogData: any) {
    this.showLoader = true;
    const data = new FormData();
    if (this.btnUpdate) {
      data.append("id", blogData.id);
      data.append('action_type', 'edit');
    }
    else if (this.btnSave) {
      data.append('action_type', 'add');
    }
    data.append("title", this.blogForm.value.title ? this.blogForm.value.title : "");
    data.append("tag", this.blogForm.value.tag ? this.blogForm.value.tag : []);
    data.append('type_of_blog', this.blogForm.value.type_of_blog ? this.blogForm.value.type_of_blog : '');
    data.append('type', this.blogForm.value.type ? this.blogForm.value.type : '');
    data.append('priority', this.blogForm.value.priority ? this.blogForm.value.priority : '');
    data.append('author_image_file', this.selectedAuthorFile ? this.selectedAuthorFile : "");
    data.append('author_name', this.blogForm.value.author_name ? this.blogForm.value.author_name : "");
    data.append('description', this.blogForm.value.description ? this.blogForm.value.description : "");
    data.append('youtube_url', this.blogForm.value.youtube_url ? this.blogForm.value.youtube_url : "");
    data.append('image_file', this.selectedFile ? this.selectedFile : "");
    data.append('author_description', this.blogForm.value.author_description ? this.blogForm.value.author_description : "");

    this.sub.add(this.fileUpService.uploadTataMitraBlog(data).subscribe((data) => {
      if (data.success) {
        this.submitted = false;
        Swal.fire({
          title: data.data.msg,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result) {
            this.blogForm.reset()
            this.showLoader = false;
            this.modalService.dismissAll();
          }
          else {
            this.blogForm.reset()
            this.showLoader = false;
            this.modalService.dismissAll();
          }
        })
      }
      else {
        Swal.fire(data.data.msg)
        this.submitted = false;
        this.blogForm.reset()
        this.showLoader = false;
        this.modalService.dismissAll();
        return
      }
    }))
  }

  onReady(e) { }
  closeModal() {
    this.createblogForm('');
    this.submitted = false;
    // this.modalService.dismissAll();
    this.modalService.dismissAll();
  }

  goBack(){
    this.modalService.dismissAll();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
