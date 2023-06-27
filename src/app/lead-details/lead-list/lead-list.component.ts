import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { LeadService } from 'src/app/shared/Services/lead.service';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss']
})
export class LeadListComponent implements OnInit {
  sub: Subscription = new Subscription();
  pagevalid: any;
  ActiveMenu: any;
  showLoader: boolean = false;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;
  leadList: any = []
  tab: any = 1;
  currDiv: string = 'Banking';
  filterFields: any;
  Filterarray: any;
  filterInputData: any;
  pageName: string
  count: any = 0
  fileTypeName: string
  leadReport: any
  closeResult: any
  leadId: any
  @ViewChild('reportAllDownload', { read: TemplateRef, static: false }) reportAllDownload: TemplateRef<any>;
  @ViewChild('leadListDetail', { read: TemplateRef, static: false }) leadListDetail: TemplateRef<any>;
  isEGURU: boolean = false;
  constructor(private datapass: DataPassService, private router: Router, private leadService: LeadService,
    private datePipe: DatePipe, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('LeadList')
    if (this.pagevalid) {
      this.filterFields = {
        "leadSearch": true,
        "LOB": true,
        "PPL": true,
        "PL": true,
        "orderStatus": true,
        "date": true,
        "requestId": true,
        "mobileNumber": true,
        "vehicleNumber": true,
        "city": true,
        "excelDownload": true,
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.currentPage = 1
      this.noofrecordsperpage = 10;
      this.showRecords = 10;
      const ListInput: Input = {} as Input;
      ListInput.offset = 0;
      ListInput.limit = 10;
      ListInput.lead_type = 'BOOKING';
      this.getleadList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getleadList(ListInput: any) {
    try {
      this.showLoader = true;
      this.FilterStrings(ListInput);
      this.totalrecord = 0;
      this.sub.add(this.leadService.getLeadList(ListInput).subscribe(
        result => {
          if (result.success) {
            this.leadList = result.data;
            this.totalrecord = result.range_info.total_count;
            this.showRecords = (((this.currentPage * 10) - 10) + result?.data?.length);
            this.showLoader = false;
          }
          else {
            this.leadList = [];
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

  onClick(event: any) {
    this.tab = event
    this.currentPage = 1
    // const page: InputPageCount = {} as InputPageCount;
    // page.action_type = "order_level";
    // page.order_from_date = localStorage.getItem("FromDate");
    // page.order_to_date = localStorage.getItem("ToDate");
    // this.GetPageCount(page)
    const ListInput: Input = {} as Input;
    ListInput.offset = 0;
    ListInput.limit = 10;
    this.isEGURU = false;

    if (this.tab == 1) {
      this.currDiv = "Banking";
      ListInput.lead_type = 'BOOKING';
      this.getleadList(ListInput);
    }
    else if (this.tab == 2) {
      this.currDiv = "Finance"
      ListInput.lead_type = 'FINANCE';
      this.getleadList(ListInput);
    }
    else if (this.tab == 3) {
      this.currDiv = "EGURU"
      this.isEGURU = true;
      const ListInput: Input = {} as Input;
      ListInput.page = 1;
      ListInput.page_size = 10;
      ListInput.third_tk = '';
      this.getEGURUleadList(ListInput);
      }
      
    }
    // this.OrderList(ListInput)

    pageChange(page: any) {
      this.currentPage = page;
      page = page - 1;
      const ListInput: Input = {} as Input;
      ListInput.offset = page;
      ListInput.limit = this.noofrecordsperpage;
      if (this.tab == 1) {
        ListInput.lead_type = "BOOKING"
      } else if (this.tab == 2) {
        ListInput.lead_type = "FINANCE"
      }

      ListInput.from_date = this.filterInputData?.from_date
      ListInput.to_date = this.filterInputData?.to_date
      ListInput.request_id = this.filterInputData?.request_id
      ListInput.lob = this.filterInputData?.LOB
      ListInput.ppl = this.filterInputData?.PPL
      ListInput.pl = this.filterInputData?.PL
      ListInput.opty_status = this.filterInputData?.orderStatus
      ListInput.mobile_number = this.filterInputData?.mobileNumber
      ListInput.vehicle_number = this.filterInputData?.vehicleNumber
      ListInput.city = this.filterInputData?.city
      this.getleadList(ListInput);
    }

    filterData(req) {
      this.filterInputData = req;
      this.pageChange(1)
    }

    excelDownload(){
      if (this.totalrecord != 0) {
        const ListInput: Input = {} as Input;
        if (this.tab == 1) {
          ListInput.lead_type = "BOOKING"
        } else if (this.tab == 2) {
          ListInput.lead_type = "FINANCE"
        }
        ListInput.from_date = this.filterInputData?.from_date
        ListInput.to_date = this.filterInputData?.to_date
        ListInput.request_id = this.filterInputData?.request_id
        ListInput.lob = this.filterInputData?.LOB
        ListInput.ppl = this.filterInputData?.PPL
        ListInput.pl = this.filterInputData?.PL
        ListInput.opty_status = this.filterInputData?.orderStatus
        ListInput.mobile_number = this.filterInputData?.mobileNumber
        ListInput.vehicle_number = this.filterInputData?.vehicleNumber
        ListInput.city = this.filterInputData?.city
        this.leadReport = ListInput;
        this.fileTypeName = "LeadList"
        this.count = this.totalrecord;
        this.pageName = "LeadList";
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

  openDetails(row) {
    this.leadId = row.id
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true
    };
    this.modalService.open(this.leadListDetail, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getEGURUleadList(ListInput: any) {
    try {
      this.showLoader = true;
      // this.FilterStrings(ListInput);
      this.totalrecord = 0;
      this.sub.add(this.leadService.getEGURULeadList(ListInput).subscribe(
        result => {
          if (result.success) {
            this.leadList = result.data.report_data;
            this.totalrecord = result.data.metaData.totalCount;
            this.showRecords = (((this.currentPage * 10) - 10) + result?.data?.report_data?.length);
            this.showLoader = false;
          }
          else {
            this.leadList = [];
            this.showLoader = false;
          }
        }, (err) => {
          this.showLoader = false;
        }
      ));
    } catch (error) {
      console.log(error)
      this.showLoader = false;
    }

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

export class Input {
  offset: any;
  limit: any;
  title: any;
  type: any;
  orderStatus: any;
  tag: any;
  author_name: any;
  id: any;
  page: any;
  page_size: any;
  third_tk: any;
  //Finance
  mobile_number: any
  lead_type: any
  pincode: any
  from_date: any
  to_date: any
  model: any
  vehicle_number: any
  city: any
  lob: any
  ppl: any
  pl: any
  opty_status: any
  request_id: any
}

