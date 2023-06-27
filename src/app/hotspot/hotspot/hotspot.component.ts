import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { FileUploadService } from 'src/app/shared/Services/file-upload/file-upload.service';
import { UserManagementService } from 'src/app/shared/Services/user-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hotspot',
  templateUrl: './hotspot.component.html',
  styleUrls: ['./hotspot.component.scss']
})
export class HotspotComponent implements OnInit {
  selectedFile: File;
  imageURL: string;
  showLoader = false;
  YValue: number;
  XValue: number;
  markers: Marker[] = [];
  fileToUpload: any;
  popupData: any;
  sub: Subscription = new Subscription();
  @ViewChild('addHotspot', { read: TemplateRef, static: false }) addHotspot: TemplateRef<any>;
  closeResult: string;
  parentImage: any;
  uploadJson: { mainImage: any; hotspotData: Marker[]; }[];
  pageType: any = 'INTERIOR';
  finalJSON = [];
  interior = [];
  exterior = [];
  performance = [];
  pagevalid: any;
  ActiveMenu: any;

  constructor(private modalService: NgbModal, private fileUpService: FileUploadService, private userService: UserManagementService, private datapass: DataPassService, private router: Router) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('HotspotList')
    if (this.pagevalid) {

      this.ActiveMenu = localStorage.getItem("subMenu");

    } else {
      this.router.navigate(['session/NOTFound']);
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
          this.uploadImage(this.fileToUpload, 'ParentImage');
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

  addMarker(event: any): void {
    Swal.fire({
      title: 'Do youw want to add hotspot?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
        const rect = event.target.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        this.XValue = offsetX
        this.YValue = offsetY

        this.openPopup();
      }
    })

  }
  // createJson() {
  //   const newMarker: Marker = {
  //     x: this.XValue,
  //     y: this.YValue,
  //     imgPath: this.fileToUpload,
  //   };
  //   this.markers.push(newMarker);
  // }

  openPopup() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'dark-modal'
    };
    this.modalService.open(this.addHotspot, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  popupDataEmit(req) {
    this.popupData = req;
    this.uploadImage(this.popupData.imgPath, 'hotspotImage')

  }

  removeImage(data?: any) {
    this.imageURL = '';
    this.fileToUpload = '';
    this.markers = [];
    this.uploadJson = [];
    // (<HTMLInputElement>document.getElementById('inputFile')).value = '';
  }

  uploadImage(image: any, flag: any) {
    this.showLoader = true;
    const data = new FormData();
    data.append("gallery_name", "hotspot_images");
    data.append('image', image);

    this.sub.add(this.fileUpService.uploadHotspotImage(data).subscribe((data) => {
      if (data.success) {
        this.showLoader = false;
        if (flag == 'ParentImage') {
          this.parentImage = data.data.image_path;
        }
        else {
          // this.parentImage = data.data.image_path;
          const newMarker: Marker = {
            id: "hotspot_" + (this.markers.length + 1),
            x: this.XValue,
            y: this.YValue,
            imgPath: data.data.image_path,
            title: this.popupData.title,
            description: this.popupData.description,
          };
          this.markers.push(newMarker);
          this.uploadJson = [
            {
              'mainImage': this.parentImage,
              'hotspotData': this.markers
            }
          ]
          if (this.pageType == 'INTERIOR') {
            this.interior = this.uploadJson;
          }
          else if (this.pageType == 'PERFORMANCE') {
            this.performance = this.uploadJson;
          }
          else if (this.pageType == 'EXTERIOR') {
            this.exterior = this.uploadJson;
          }
          this.finalJSON = [{
            "interior": this.interior,
            "exterior": this.exterior,
            "performance": this.performance,
          }]
          Swal.fire({
            title: data.data.msg,
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result) {
              this.showLoader = false;
            }
            else {
              this.showLoader = false;
            }
          })
        }
      }
      else {
        Swal.fire(data.data.msg)
        this.showLoader = false;
        return
      }
    }))
  }

  saveHotspot() {

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to upload hotspot data for",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        // this.finalJSON = [{
        //   "interior": this.interior,
        //   "exterior": this.exterior,
        //   "performance": this.performance,
        // }]
        var json = {
          "action_type": "add_hotspot",
          "ppl": "Intra",
          "vc_number": "555",
          "hotspot_data": this.finalJSON
        }
        // console.log(this.finalJSON);
        // return
        this.sub.add(this.userService.uploadHotspotJSON(json).subscribe((data) => {
          if (data.success) {
            this.showLoader = false;
          }
          else {
            Swal.fire(data.data.msg)
            this.showLoader = false;
            return
          }
        }))
      }
    })


  }

  OnchagePageType(value) {
    this.pageType = value.target.value;
    this.markers = [];
    this.uploadJson = [];
    this.imageURL = '';
    this.fileToUpload = '';
    if (this.pageType == 'INTERIOR') {
      this.imageURL = this.finalJSON[0]?.interior[0]?.mainImage ? this.finalJSON[0]?.interior[0].mainImage : '';
      this.markers = this.finalJSON[0]?.interior[0]?.hotspotData ? this.finalJSON[0]?.interior[0].hotspotData : [];
      this.uploadJson = this.finalJSON[0]?.interior ? this.finalJSON[0]?.interior : [];
    }
    else if (this.pageType == 'PERFORMANCE') {
      this.imageURL = this.finalJSON[0]?.performance[0]?.mainImage ? this.finalJSON[0]?.performance[0].mainImage : '';
      this.markers = this.finalJSON[0]?.performance[0]?.hotspotData ? this.finalJSON[0]?.performance[0].hotspotData : [];
      this.uploadJson = this.finalJSON[0]?.performance ? this.finalJSON[0]?.performance : [];
    }
    else if (this.pageType == 'EXTERIOR') {
      this.imageURL = this.finalJSON[0]?.exterior[0]?.mainImage ? this.finalJSON[0]?.exterior[0].mainImage : '';
      this.markers = this.finalJSON[0]?.exterior[0]?.hotspotData ? this.finalJSON[0]?.exterior[0].hotspotData : [];
      this.uploadJson = this.finalJSON[0]?.exterior ? this.finalJSON[0]?.exterior : [];
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

interface Marker {
  id: any;
  x: number;
  y: number;
  imgPath: any;
  title: any;
  description: any;
}
