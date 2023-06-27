import { Component, OnInit, EventEmitter, Output, Input, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-hotspot',
  templateUrl: './add-hotspot.component.html',
  styleUrls: ['./add-hotspot.component.scss']
})
export class AddHotspotComponent implements OnInit {
  sub: Subscription = new Subscription();
  @Output() popupDataEmit = new EventEmitter<any>();
  showLoader = false;
  public hotspotForm: FormGroup;
  imageURL: string;
  fileToUpload: any;
  constructor(private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.imageURL = '';
    this.createhotspotForm();
  }
  goBack() {
    this.modalService.dismissAll();
  }

  createhotspotForm() {

    this.hotspotForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
    });
  }
  save() {    
    if(this.hotspotForm.invalid || this.imageURL == ''){
      Swal.fire('Please add all details');
      return;
    }
    let req: FilterInput = new FilterInput();
    req.title = this.hotspotForm.controls['title'].value ? this.hotspotForm.controls['title'].value : '';
    req.description = this.hotspotForm.controls['description'].value ? this.hotspotForm.controls['description'].value : '';
    req.imgPath = this.fileToUpload ? this.fileToUpload : '';
    // req.imgPath = this.imageURL ? this.imageURL : '';

    this.popupDataEmit.emit(req);
    this.modalService.dismissAll();
  }
  omit_space_at_start(event) {
    if (event.target.selectionStart === 0 && event.code === "Space") {
      event.preventDefault();
    }
  }
  onSelectImagefile(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.fileToUpload = event.target.files.item(0);
      var name = event.target.files[0].name
      var size = event.target.files[0].size;
      var AcSize = Math.round(size / 1024);
      var Extension = event.target.files[0].name.substring(
        event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();

      if (Extension == 'PNG' || Extension == 'JPG' || Extension == 'jpg' || Extension == 'png' || Extension == 'webp' || Extension == 'WEBP') {
        const reader = new FileReader();
        const file = event.target.files[0];
        if (AcSize < 300) {
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            this.imageURL = img.src
            img.onload = () => {
              const width = img.width;
              const height = img.height;
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
    this.imageURL = '';
    (<HTMLInputElement>document.getElementById('inputFile')).value = '';
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
export class FilterInput {
  title: string;
  description: string;
  imgPath: any;
}