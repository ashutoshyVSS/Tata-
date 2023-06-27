import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { FileUploadService } from 'src/app/shared/Services/file-upload/file-upload.service';
import { UserManagementService } from 'src/app/shared/Services/user-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @ViewChild('banner', { read: TemplateRef, static: false }) banner: TemplateRef<any>;

  sub: Subscription = new Subscription();
  ActiveMenu: any;
  showLoader: boolean = false

  filterInputData: any;
  filterFields: any;
  Filterarray: any;
  closeResult: any;

  pagevalid: any;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;

  bannerList = []
  rowData: any

  Pagenumber: any;
  offset: any;
  tableOffset: any;
  pageType: any = 'HOME';

  constructor(private UserManagementService: UserManagementService, private modalService: NgbModal, private datePipe: DatePipe,
    private fileUploadService: FileUploadService, private router: Router, private datapass: DataPassService,) { }


  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('FeedBackList')
    if (this.pagevalid) {
      this.filterFields = {
        // "referralSearch": true,
        "date": true,
        "bannerstatus": true,
        "bannerPriority": true,
        "bannerSubLob": true,
        "bannerLob": true,
        "bannerPages": true,
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.tableOffset = 0;
      this.Pagenumber = 0;
      const ListInput: Input = {} as Input;
      ListInput.Pagenumber = 0
      ListInput.offset = 0;
      ListInput.size = 10;
      ListInput.page = 'HOME';
      this.getBannerList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getBannerList(input) {
    try {
      this.showLoader = true
      var numer = input.Pagenumber;

      const ListInput: Input = {} as Input;
      ListInput.offset = numer * 10 + 0;
      ListInput.size = numer * 10 + 10;
      ListInput.is_active = input.is_active ? input.is_active : '';
      ListInput.from_date = input.from_date ? input.from_date : '';
      ListInput.to_date = input.to_date ? input.to_date : '';
      ListInput.priority = input.priority ? input.priority : '';
      ListInput.sub_lob = input.sub_lob ? input.sub_lob : '';
      ListInput.lob = input.lob ? input.lob : '';
      ListInput.page = input.page ? input.page : '';
      this.bannerList = [];
      this.FilterStrings(ListInput);
      this.sub.add(this.UserManagementService.getBannerList(ListInput).subscribe(
        (result) => {
          this.showLoader = false
          if (result.success) {
            this.bannerList = result.data;
            this.totalrecord = result.range_info.total_count;
            this.showLoader = false
          } else {
            this.bannerList = [];
            this.totalrecord = 0;
            this.showLoader = false
          }
        },
        (err) => {
          this.showLoader = false
        }
      ));
    } catch (error) {
      this.showLoader = false
    }
  }

  filterData(req) {
    this.filterInputData = req;
    this.pageChange(1)
  }

  pageChange(page: any) {
    this.currentPage = page;
    this.Pagenumber = page
    page = page - 1;
    const ListInput: Input = {} as Input;
    ListInput.offset = page;
    ListInput.Pagenumber = page
    ListInput.is_active = this.filterInputData?.bannerStatus;
    ListInput.from_date = this.filterInputData?.from_date ? moment(this.filterInputData?.from_date).format("yyyy-MM-DD hh:mm:ss") : '';
    ListInput.to_date = this.filterInputData?.from_date ? moment(this.filterInputData?.to_date).format("yyyy-MM-DD hh:mm:ss") : '';
    ListInput.priority = this.filterInputData?.bannerPriority;
    ListInput.sub_lob = this.filterInputData?.bannerSubLob;
    ListInput.lob = this.filterInputData?.bannerLob;
    ListInput.page = this.filterInputData?.bannerPages;
    this.getBannerList(ListInput);
  }

  FilterStrings(ListInput) {
    this.Filterarray = [];
    for (let item in ListInput) {
      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'is_active');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'priority');

    if (ListInput.from_date && ListInput.from_date) {
      if (ListInput.from_date != null || ListInput.to_date != null || ListInput.from_date != '' || ListInput.to_date != '') {
        var finaldate = this.dateformate(ListInput.from_date) + ' ' + 'to' + ' ' + this.dateformate(ListInput.to_date);
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
        var Json1 = { "Key": 'from_date', "Value": finaldate }
        this.Filterarray.push(Json1)
      }
    }
    if (ListInput.is_active) {
      if (ListInput.is_active == true) {
        var Json1 = { "Key": 'is_active', "Value": 'Active' }
      }
      else {
        var Json1 = { "Key": 'is_active', "Value": 'Inactive' }
      }
      this.Filterarray.push(Json1)
    }
    if (ListInput.priority) {
      if (ListInput.priority == '2') {
        var Json1 = { "Key": 'priority', "Value": ListInput.priority + 'nd' + ' Priority' }
      }
      else if (ListInput.priority == '3') {
        var Json1 = { "Key": 'priority', "Value": ListInput.priority + 'rd' + ' Priority' }
      }
      else {
        var Json1 = { "Key": 'priority', "Value": ListInput.priority + 'th' + ' Priority' }
      }
      this.Filterarray.push(Json1)
    }
  }

  dateformate(date) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  openPopup(row, flag) {
    this.rowData = row

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'dark-modal'
    };
    this.modalService.open(this.banner, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      const ListInput: Input = {} as Input;
      ListInput.Pagenumber = this.currentPage - 1
      this.getBannerList(ListInput);
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

  Approve(row) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure want to Publish?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        const ListInput: AprroveRejectJson = {} as AprroveRejectJson;
        ListInput.status = "ACT"
        ListInput.id = row.id;
        this.ApproveReject(ListInput)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  DeApprove(row) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure want to Un-publish?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        const ListInput: AprroveRejectJson = {} as AprroveRejectJson;
        ListInput.status = "DCT"
        ListInput.id = row.id;
        this.ApproveReject(ListInput)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  ApproveReject(data) {
    try {
      this.sub.add(this.fileUploadService.changeBannerStatus(data.id, data.status).subscribe(
        data => {
          if (data.success == true) {
            const ListInput: Input = {} as Input;
            ListInput.Pagenumber = this.Pagenumber - 1
            Swal.fire({
              title: data.data.msg,
              // text: "You won't be able to revert this!",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.getBannerList(ListInput);
              }
              else {
                this.getBannerList(ListInput);
              }
            })
          }
          else {
            // this.items = this.temp = [];
            //this.loader.close();
          }
        }, (err) => {
        }
      ));
    } catch (error) {
      this.showLoader = false
    }
  }

  OnchagePageType(value) {
    this.pageType = value.target.value;
    const ListInput: Input = {} as Input;
    ListInput.Pagenumber = 0;
    ListInput.offset = 0;
    ListInput.size = 10;

    if (this.pageType == 'HOME') {
      ListInput.page = 'HOME'
    }
    else if (this.pageType == 'EXPLORE') {
      ListInput.page = 'EXPLORE'
    }
    else if (this.pageType == 'FINANCE') {
      ListInput.page = 'FINANCE'
    }
    this.getBannerList(ListInput);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

export class Input {
  offset: number;
  size: number;
  from_date: string;
  to_date: string;
  status: string;
  is_active: string;
  priority: string;
  title: string;
  pages: any;
  page: any;
  lob: any;
  sub_lob: any;
  Pagenumber: number
}

export class AprroveRejectJson {
  offset = 0;
  status: string;
  id: number;
}


