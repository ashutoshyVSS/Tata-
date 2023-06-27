import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/shared/Services/excel.service';
import { VehicleService } from 'src/app/shared/Services/vehicle.service';
import Swal from 'sweetalert2';
import { HttpHeaderResponse } from '@angular/common/http';
import { FileUploadService } from 'src/app/shared/Services/file-upload/file-upload.service';

@Component({
  selector: 'app-vehicle-bulk-upload',
  templateUrl: './vehicle-bulk-upload.component.html',
  styleUrls: ['./vehicle-bulk-upload.component.scss']
})
export class VehicleBulkUploadComponent implements OnInit {
  sub: Subscription = new Subscription();
  showLoader = false;
  isImagesTab = false;
  DocumentFile: any;
  @ViewChild('inputFile', { static: false }) myInputVariable: ElementRef;
  @ViewChild('inputImagesFile', { static: false }) inputImagesFile: ElementRef;
  
  constructor(private modalService: NgbModal, private vehicleService: VehicleService, private router: Router, private excelService: ExcelService, private fileUpService: FileUploadService) { }

  ngOnInit(): void {
  }
  goBack() {
    this.modalService.dismissAll()
  }

  SelectDocumentFiles(event) {
    // console.log("data",event);

    var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'
    Swal.fire({
      title: 'Confirmation',
      text: msg,
      // title: 'Are you sure want to Publish?',
      // text: 'You will not be able to recover this file!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        if (event.target.files && event.target.files[0]) {
          var Extension = event.target.files[0].name.substring(
            event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
          if (Extension == "xls" || Extension == "xlsx") {
            const reader = new FileReader();
            const file = event.target.files[0];
            this.DocumentFile = file;
            if (file.size < 5000000) {
              reader.readAsDataURL(event.target.files[0]);
              reader.onload = (event) => {
                let target: any = event.target;
                this.UploadCSV();
              }
            }
            else {
              Swal.fire('Oops...', 'Upload only 5 MB size files!')
            }
          }
          else {
            this.myInputVariable.nativeElement.value = '';
            Swal.fire('Upload only xls/xlsx Files');
          }
        };
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })

  }

  UploadCSV() {
    var Check = false;
    const formData = new FormData();
    formData.append('files', this.DocumentFile);
    Check = true
    if (Check) {
      this.showLoader = true
      this.sub.add(this.fileUpService.uploadvehicleCSV(formData).subscribe(data => {
        if (data.success == true) {
          if (data.data.length > 0) {
            this.showLoader = false
            Swal.fire({
              title: 'File Uploaded Successfully!! Please check downloaded sheet for Status (Column name : upload_reason)',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.showLoader = false;
                this.DocumentFile = "";
                this.router.navigate(['pages/VehicleUpload']);
                this.excelService.exportAsExcelFile(data.data, 'Bulk Upload Status file');
                this.myInputVariable.nativeElement.value = "";
              }
              else {
                this.showLoader = false;
                this.DocumentFile = "";
                this.router.navigate(['pages/VehicleUpload']);
                this.excelService.exportAsExcelFile(data.data, 'Bulk Upload Status file');
                this.myInputVariable.nativeElement.value = "";
              }
            })
          }
          else {
            this.showLoader = false;
            this.DocumentFile = "";
            this.myInputVariable.nativeElement.value = "";
            this.showLoader = false
            Swal.fire('Empty Data')
            this.router.navigate(['pages/VehicleUpload']);
          }
        }
        else {
          this.showLoader = false
          this.DocumentFile = "";
          this.myInputVariable.nativeElement.value = "";
          this.showLoader = false
          this.showLoader = false
          Swal.fire('Invalid file format. Please reupload using the assigned format only')
          this.router.navigate(['pages/VehicleUpload']);
        }

      }))
    }
    else {
      this.showLoader = false
      Swal.fire('Error Occured , Please Try After Some Times')
    }
  }

  onChange(flag) {
    if (flag == 'vehicleBulkUpload') {
      this.isImagesTab = false
    }
    else {
      this.isImagesTab = true
    }
  }

  SelectImageDocumentFiles(event) {
    var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'

      Swal.fire({
        title: 'Confirmation',
        text: msg,
        // title: 'Are you sure want to Publish?',
        // text: 'You will not be able to recover this file!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          if (event.target.files && event.target.files[0]) {
            var Extension = event.target.files[0].name.substring(
              event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
            if (Extension == "zip" || Extension == "7zip") {
              const reader = new FileReader();
              const file = event.target.files[0];
              this.DocumentFile = file;
              if (file.size / 1024 / 1024 < 50) {
                reader.readAsDataURL(event.target.files[0]);
                reader.onload = (event) => {
                  this.uploadVCImagesZip();
                }
              }
              else {
                Swal.fire({
                  title: 'Oops...',
                  icon: 'warning',
                  text: 'File is bigger than 50MB!'
                });
              }
            }
            else {
              this.inputImagesFile.nativeElement.value = '';
              Swal.fire({
                title: 'Oops...',
                icon: 'warning',
                text: 'Please upload only zip file format only'
              });
            }
          };
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      })
  }
  uploadVCImagesZip() {
    var temparray = []
    this.showLoader = true;
    var Check = false;
    const formData = new FormData();
    formData.append('zip', this.DocumentFile);
    Check = true;
    if (Check) {
      this.sub.add(this.fileUpService.uploadBulkVCImage(formData).subscribe(res => {
        if (res instanceof HttpHeaderResponse) {
          return;
        }
        if (res.success == true) {
          this.showLoader = false
          Swal.fire({
            icon: 'success',
            text: res.data.msg
          });
          if (res.data.vc_not_found && res.data.vc_not_found.length) {
            res.data.vc_not_found.forEach(function (value) {
              var data = { "VC_Number not found": value }
              temparray.push(data);
            });
            if (res.data.updated_vc_s && res.data.updated_vc_s.length) {
              res.data.updated_vc_s.forEach(function (value) {
                var data = { "Updated Vehicle": value }
                temparray.push(data);
              });
            }
            if (res.data.unsupported_ext && res.data.unsupported_ext.length) {
              res.data.unsupported_ext.forEach(function (value) {
                var data = { "Unsupported Extension": value }
                temparray.push(data);
              });
            }

            if (res.data.greater_than_1mb && res.data.greater_than_1mb.length) {
              res.data.greater_than_1mb.forEach(function (value) {
                var data = { "Greater than 1mb": value }
                temparray.push(data);
              });
            }
            this.excelService.exportAsExcelFile(temparray, 'Bulk Upload Vehicle Image Status file');
          }
          this.DocumentFile = [];
          this.inputImagesFile.nativeElement.value = "";
          this.router.navigate(['pages/VehicleImagesBulkUpload']);
        }
        else {
          this.showLoader = false
          Swal.fire({
            text: res.data.msg + 'Please check the response in downloaded excel file'
          });
          if (res.data.vc_not_found && res.data.vc_not_found.length) {
            res.data.vc_not_found.forEach(function (value) {
              var data = { "VC_Number not found": value }
              temparray.push(data);
            });
            if (res.data.updated_vc_s && res.data.updated_vc_s.length) {
              res.data.updated_vc_s.forEach(function (value) {
                var data = { "Updated Vehicle": value }
                temparray.push(data);
              });
            }
            if (res.data.unsupported_ext && res.data.unsupported_ext.length) {
              res.data.unsupported_ext.forEach(function (value) {
                var data = { "Unsupported Extension": value }
                temparray.push(data);
              });
            }

            if (res.data.greater_than_1mb && res.data.greater_than_1mb.length) {
              res.data.greater_than_1mb.forEach(function (value) {
                var data = { "Greater than 1mb": value }
                temparray.push(data);
              });
            }
            this.excelService.exportAsExcelFile(temparray, 'Bulk Upload Vehicle Image Status file');
          }
          this.DocumentFile = [];
          this.inputImagesFile.nativeElement.value = "";
          this.router.navigate(['pages/VehicleImagesBulkUpload']);
        }
      }, error => {
        this.showLoader = false
        Swal.fire({
          text: error.error.data.msg + 'Please check the response in downloaded excel file'
        });
        if (error.error.data.vc_not_found && error.error.data.vc_not_found.length) {
          error.error.data.vc_not_found.forEach(function (value) {
            var data = { "VC_Number not found": value }
            temparray.push(data);
          });
          if (error.error.data.updated_vc_s && error.error.data.updated_vc_s.length) {
            error.error.data.updated_vc_s.forEach(function (value) {
              var data = { "Updated Vehicle": value }
              temparray.push(data);
            });
          }
          if (error.error.data.unsupported_ext && error.error.data.unsupported_ext.length) {
            error.error.data.unsupported_ext.forEach(function (value) {
              var data = { "Unsupported Extension": value }
              temparray.push(data);
            });
          }

          if (error.error.data.greater_than_1mb && error.error.data.greater_than_1mb.length) {
            error.error.data.greater_than_1mb.forEach(function (value) {
              var data = { "Greater than 1mb": value }
              temparray.push(data);
            });
          }
          this.excelService.exportAsExcelFile(temparray, 'Bulk Upload Vehicle Image Status file');
        }
        this.DocumentFile = [];
        this.inputImagesFile.nativeElement.value = "";
        this.router.navigate(['pages/VehicleImagesBulkUpload']);
      }))
    }
    else {
      this.showLoader = false
      this.inputImagesFile.nativeElement.value = "";
      Swal.fire('Error Occured , Please Try After Some Times');
      this.router.navigate(['pages/VehicleImagesBulkUpload']);
    }
  }

}
