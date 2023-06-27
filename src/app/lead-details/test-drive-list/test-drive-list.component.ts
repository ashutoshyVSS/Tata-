import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { LeadService } from 'src/app/shared/Services/lead.service';
import { ExcelService } from 'src/app/shared/Services/excel.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-test-drive-list',
  templateUrl: './test-drive-list.component.html',
  styleUrls: ['./test-drive-list.component.scss']
})
export class TestDriveListComponent implements OnInit {
  sub: Subscription = new Subscription();
  pagevalid: any;
  ActiveMenu: any;
  showLoader: boolean = false;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;
  testDriveList: any = []
  testaay: any = [];
  page: any = {
    pageNumber: 0,
    size: 0,
    totalElements: 0,
  };
  filterFields: any;
  Filterarray: any[];
  filterInputData: any;

  pageName: string
  count: any = 0
  fileTypeName: string;
  testDriveReport: any;
  closeResult: any;
  @ViewChild('reportAllDownload', { read: TemplateRef, static: false }) reportAllDownload: TemplateRef<any>;

  constructor(private datapass: DataPassService, private router: Router, private leadService: LeadService, private excelService: ExcelService, private datePipe: DatePipe, private modalService: NgbModal) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
  }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('TestDriveList')
    if (this.pagevalid) {
      this.filterFields = {
        "testDriveSearch": true,
        "date": true,
        "mobileNumber": true,
        "pincode": true,
        "testDriveProduct": true,
        "testDriveModel": true,
        "leadReferenceId": true,
        "testDriveStatus": true,
        "excelDownload": true
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.currentPage = 1
      this.noofrecordsperpage = 10;
      this.showRecords = 10;
      const ListInput: Input = {} as Input;
      ListInput.offset = 0;
      ListInput.size = 10;
      this.getTestDriveList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getTestDriveList(ListInput: any) {
    try {
      this.showLoader = true;
      this.totalrecord = 0;
      this.FilterStrings(ListInput)
      this.sub.add(this.leadService.getTestDriveList(ListInput).subscribe(
        result => {
          if (result.success) {
            this.testDriveList = result.data;
            this.totalrecord = result.range_info.total_count;
            this.showRecords = (((this.currentPage * 10) - 10) + result?.data?.length);
            this.showLoader = false;
          }
          else {
            this.testDriveList = [];
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
  // this.OrderList(ListInput)

  FilterStrings(ListInput) {
    this.Filterarray = [];
    for (let item in ListInput) {
      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'limit');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
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
    ListInput.size = this.noofrecordsperpage;
    ListInput.from_date = this.filterInputData?.from_date
    ListInput.mobile_number = this.filterInputData?.mobileNumber
    ListInput.pincode = this.filterInputData?.pincode
    ListInput.model = this.filterInputData?.model
    ListInput.ppl = this.filterInputData?.product
    ListInput.lead_ref_id = this.filterInputData?.leadReferenceId
    ListInput.status = this.filterInputData?.testDriveStatus
    // ListInput.date_field = this.filterInputData?.from_date
    this.getTestDriveList(ListInput);
  }

  calculateDiff(first_updated_at: any, created_Date: any) {
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

  // reportDownload() {
  //   this.testaay = []
  //   if (this.page.totalElements == 0) {
  //     Swal.fire('No data to Export')
  //     return
  //   }
  //   // this.loader.open();

  //   const ListInput: Input = {} as Input;
  //   ListInput.offset = 0
  //   ListInput.size = this.page.totalElements;

  //   this.getTestDriveList(ListInput)

  //   this.leadService.TestDriveList(ListInput).subscribe(
  //     data => {
  //       if (data.success == true) {
  //         for (let entry of data.data) {
  //           const Input: ExportData = {} as ExportData;
  //           Input.Name = entry.name
  //           Input.Mobile_Number = entry.mobile_number
  //           Input.Product = entry.product.ppl
  //           Input.Model = entry.product.model
  //           Input.Pincode = entry.pincode
  //           Input.LeadRefID = entry.lead_ref_id
  //           Input.Status = entry.status
  //           Input.Scheduled_date = this.datePipe.transform(entry.scheduled_on, 'dd-MM-yyyy'),
  //             Input.Created_date = this.datePipe.transform(entry.created_date, 'dd-MM-yyyy hh:mm a'),
  //             Input.First_Updated_date = this.datePipe.transform(entry.first_updated_at, 'dd-MM-yyyy hh:mm:a'),
  //             Input.Last_Updated_date = this.datePipe.transform(entry.updated_date, 'dd-MM-yyyy hh:mm:a'),
  //             Input.TAT = entry.first_updated_at !== '' ? this.calculateDiff(entry.first_updated_at, entry.created_date) : '',

  //             this.testaay.push(Input)
  //         }
  //         this.excelService.exportAsExcelFile(this.testaay, 'TestDriveList');
  //         // this.loader.close();
  //       }
  //       else {
  //         // this.loader.close();
  //       }
  //     }, (err) => {
  //       // this.loader.close();
  //     }
  //   );
  // }

  excelDownload() {
    if (this.totalrecord != 0) {
      const ListInput: Input = {} as Input;

      ListInput.size = this.noofrecordsperpage;
      ListInput.from_date = this.filterInputData?.from_date
      ListInput.mobile_number = this.filterInputData?.mobileNumber
      ListInput.pincode = this.filterInputData?.pincode
      ListInput.model = this.filterInputData?.model
      ListInput.ppl = this.filterInputData?.product
      ListInput.lead_ref_id = this.filterInputData?.leadReferenceId
      ListInput.status = this.filterInputData?.testDriveStatus
      this.testDriveReport = ListInput;
      this.fileTypeName = "TestDriveList"
      this.count = this.totalrecord;
      this.pageName = "TestDriveList";
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
  size: any;
  from_date: any;
  mobile_number: any;
  pincode: any;
  model: any;
  ppl: any;
  lead_ref_id: any;
  status: any;
  date_field: any;

}

