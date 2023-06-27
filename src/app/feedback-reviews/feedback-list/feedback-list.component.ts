import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { FeedbackService } from 'src/app/shared/Services/feedback.service';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss']
})
export class FeedbackListComponent implements OnInit {
  @ViewChild('reportAllDownload', { read: TemplateRef, static: false }) reportAllDownload: TemplateRef<any>;
  @ViewChild('feedbackDetail', { read: TemplateRef, static: false }) feedbackDetail: TemplateRef<any>;

  sub: Subscription = new Subscription();
  ActiveMenu: any;
  showLoader: boolean = false
  pagevalid: any;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;
  feedBackList: any = []
  filterInputData: any;
  filterFields: any;
  Filterarray: any;
  closeResult: any
  feedbackData: any

  fileTypeName: string
  leadReport:any
  pageName: string
  count: any = 0

  constructor(private datapass: DataPassService, private router: Router, private feedbackservice: FeedbackService, private datePipe: DatePipe,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('FeedBackList')
    if (this.pagevalid) {
      this.filterFields = {
        // "referralSearch": true,
        "date": true,
        "rating": true,
        "title": true,
        "vcNumber": true,
        "model": true,
        // "excelDownload": true,
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.currentPage = 1
      this.noofrecordsperpage = 10;
      this.showRecords = 10;
      const ListInput: Input = {} as Input;
      ListInput.offset = 0;
      ListInput.limit = 10;
      this.getFeedBackList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getFeedBackList(ListInput: any) {
    try {
      this.showLoader = true;
      this.totalrecord = 0;
      this.FilterStrings(ListInput);
      this.sub.add(this.feedbackservice.feedbackList(ListInput).subscribe(
        result => {
          if (result.success) {
            this.feedBackList = result.data;
            this.totalrecord = result.range_info.total_count;
            this.showRecords = (((this.currentPage * 10) - 10) + result?.data?.length);
            this.showLoader = false;
          }
          else {
            this.feedBackList = [];
            this.showLoader = false;
          }
        }, (err) => {
          this.showLoader = false;
        }
      ));
    } catch (error) {
      console.log(error)
    }

  }

  FilterStrings(ListInput) {
    this.Filterarray = [];
    for (let item in ListInput) {
      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'limit');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'lead_type');

    if (ListInput.from_date && ListInput.from_date) {
      if (ListInput.from_date != null || ListInput.to_date != null || ListInput.from_date != '' || ListInput.to_date != '') {
        var finaldate = this.dateformate(ListInput.from_date) + ' ' + 'to' + ' ' + this.dateformate(ListInput.to_date);
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
        var Json1 = { "Key": 'from_date', "Value": finaldate }
        this.Filterarray.push(Json1)
      }
    }
  }

  dateformate(date) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  filterData(req) {
    this.filterInputData = req;
    this.pageChange(1)
  }

  pageChange(page: any) {
    this.currentPage = page;
    page = page - 1;
    const ListInput: Input = {} as Input;
    ListInput.offset = page;
    ListInput.limit = this.noofrecordsperpage;
    ListInput.from_date = this.filterInputData?.from_date
    ListInput.to_date = this.filterInputData?.to_date
    ListInput.category = this.filterInputData?.title
    ListInput.models = this.filterInputData?.model
    ListInput.rating = this.filterInputData?.rating
    ListInput.vc = this.filterInputData?.vcNumber
    this.getFeedBackList(ListInput);
  }

  openDetails(row) {
    this.feedbackData = row;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: 'sm',
      fullscreen: 'sm'
    };
    this.modalService.open(this.feedbackDetail, ngbModalOptions).result.then((result) => {
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

  checkstatus(status) {
    var statusq
    if (status == "PENDING" || status == "DISAPPROVED") {
      statusq = true
    }
    else {
      statusq = false
    }
    return statusq;
  }

  Approve(row) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure want to Publish?',
      // title: 'Are you sure want to Publish?',
      // text: 'You will not be able to recover this file!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        const ListInput: AprroveRejectJson = {} as AprroveRejectJson;
        ListInput.status = "APPROVED"
        ListInput.id = row.id
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
        ListInput.status = "DISAPPROVED"
        ListInput.id = row.id
        this.ApproveReject(ListInput)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  ApproveReject(ListInput) {
    this.feedbackservice.ApproveRejectFeedbak(ListInput).subscribe(
      data => {
        if (data.success == true) {
          const ListInput: Input = {} as Input;
          ListInput.offset = 0

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
              this.getFeedBackList(ListInput);
            }
            else {
              this.getFeedBackList(ListInput);
            }
          })
        }
        else {
          // this.items = this.temp = [];
          //this.loader.close();
        }
      }, (err) => {
      }
    );
  }

  excelDownload(){
    if (this.totalrecord != 0) {
      const ListInput: Input = {} as Input;
      ListInput.from_date = this.filterInputData?.from_date
      ListInput.to_date = this.filterInputData?.to_date
      ListInput.category = this.filterInputData?.title
      ListInput.models = this.filterInputData?.model
      ListInput.rating = this.filterInputData?.rating
      ListInput.vc = this.filterInputData?.vcNumber
        this.leadReport = ListInput;
        this.fileTypeName = "FeedbackList"
        this.count = this.totalrecord;
        this.pageName = "FeedbackList";
        let ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false
        };
        this.modalService.open(this.reportAllDownload, ngbModalOptions).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    else {
      Swal.fire('No Data for Downloading..')
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

export class Input {
  offset: any;
  limit: any;
  from_date: any;
  to_date: any;
  category: any;
  models: any
  rating: any
  vc: any
  model:any
  name:any
  title:any;
  date:any
}

export class AprroveRejectJson {
  id: number;
  status: string;
}
