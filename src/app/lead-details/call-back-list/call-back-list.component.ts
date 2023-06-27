import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { LeadService } from 'src/app/shared/Services/lead.service';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-call-back-list',
  templateUrl: './call-back-list.component.html',
  styleUrls: ['./call-back-list.component.scss']
})
export class CallBackListComponent implements OnInit {
  sub: Subscription = new Subscription();
  pagevalid: any;
  ActiveMenu: any;
  showLoader: boolean = false;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;
  callBackList: any = []
  filterInputData: any;
  filterFields: any;
  Filterarray: any;

  pageName: string
  count: any = 0
  fileTypeName: string;
  callBackReport: any;
  closeResult: any;
  @ViewChild('reportAllDownload', { read: TemplateRef, static: false }) reportAllDownload: TemplateRef<any>;
  
  constructor(private datapass: DataPassService, private router: Router, private leadService: LeadService, private datePipe: DatePipe, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('CallBackList')
    if (this.pagevalid) {
      this.filterFields = {
        "callBackSearch": true,
        "date": true,
        "mobileNumber": true,
        "pincode": true,
        "callBackProduct": true,
        "callBackActionType": true,
        "leadReferenceId": true,
        "callBackStatus": true,
        "excelDownload": true
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.currentPage = 1
      this.noofrecordsperpage = 10;
      this.showRecords = 10;
      const ListInput: Input = {} as Input;
      ListInput.offset = 0;
      ListInput.limit = 10;
      this.getcallBackList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getcallBackList(ListInput: any) {
    try {
      this.showLoader = true;
      this.totalrecord = 0;
      this.FilterStrings(ListInput);
      this.sub.add(this.leadService.getCallBackList(ListInput).subscribe(
        result => {
          if (result.success) {
            this.callBackList = result.data;
            this.totalrecord = result.range_info.total_count;
            this.showRecords = (((this.currentPage * 10) - 10) + result?.data?.length);
            this.showLoader = false;
          }
          else {
            this.callBackList = [];
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
    ListInput.mobile = this.filterInputData?.mobileNumber
    ListInput.pincode = this.filterInputData?.pincode

    // ListInput.date_field = this.filterInputData?.pincode
    ListInput.status = this.filterInputData?.callBackStatus
    ListInput.lead_ref_id = this.filterInputData?.leadReferenceId
    ListInput.product = this.filterInputData?.product
    ListInput.action_type = this.filterInputData?.callBackActionType
    this.getcallBackList(ListInput);
  }

  calculateDiff(first_updated_at, created_Date) {
    let firstUpdatedDate: any = new Date(first_updated_at);
    let createdDate: any = new Date(created_Date);
    let duration: any = Math.floor((
      Date.UTC(firstUpdatedDate.getFullYear(), firstUpdatedDate.getMonth(), firstUpdatedDate.getDate()) -
      Date.UTC(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate())) / (1000 * 60 * 60 * 24));


    let delta = Math.abs(firstUpdatedDate - createdDate) / 1000;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = delta % 60

    return days + ' Days ' + hours + " Hrs " + minutes + " Mins ";
    // + seconds + " Seconds " ;

  }

  excelDownload() {
    if (this.totalrecord != 0) {
      const ListInput: Input = {} as Input;

      ListInput.limit = this.noofrecordsperpage;
      ListInput.from_date = this.filterInputData?.from_date
      ListInput.to_date = this.filterInputData?.to_date
      ListInput.mobile = this.filterInputData?.mobileNumber
      ListInput.pincode = this.filterInputData?.pincode

      // ListInput.date_field = this.filterInputData?.pincode
      ListInput.status = this.filterInputData?.callBackStatus
      ListInput.lead_ref_id = this.filterInputData?.leadReferenceId
      ListInput.product = this.filterInputData?.product
      ListInput.action_type = this.filterInputData?.callBackActionType
      this.callBackReport = ListInput;
      this.fileTypeName = "CallBackList"
      this.count = this.totalrecord;
      this.pageName = "CallBackList";
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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
  mobile: any;
  pincode: any;
  status: any
  lead_ref_id: any
  product: any
  action_type: any

}
