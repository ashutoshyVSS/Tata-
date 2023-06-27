import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { LeadService } from 'src/app/shared/Services/lead.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  sub: Subscription = new Subscription();
  pagevalid: any;
  ActiveMenu: any;
  showLoader: boolean = false;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;
  customerList: any = []
  filterInputData: any;
  filterFields: any;
  Filterarray: any;

  constructor(private datapass: DataPassService, private router: Router, private leadService: LeadService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('CustomerList')
    if (this.pagevalid) {
      this.filterFields = {
        "customerSearch": true,
        "date": true,
        "mobileNumber": true,
        "pincode": true,
        // "excelDownload": true
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.currentPage = 1
      this.noofrecordsperpage = 10;
      this.showRecords = 10;
      const ListInput: Input = {} as Input;
      ListInput.offset = 0;
      ListInput.limit = 10;
      this.getCustomerList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getCustomerList(ListInput: any) {
    try {
      this.showLoader = true;
      this.totalrecord = 0;
      this.FilterStrings(ListInput);
      this.sub.add(this.leadService.getCustomerList(ListInput).subscribe(
        result => {
          if (result.success) {
            this.customerList = result.data;
            this.totalrecord = result.range_info.total_count;
            this.showRecords = (((this.currentPage * 10) - 10) + result?.data?.length);
            this.showLoader = false;
          }
          else {
            this.customerList = [];
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
    ListInput.mobile_number = this.filterInputData?.mobileNumber
    ListInput.pincode = this.filterInputData?.pincode
    this.getCustomerList(ListInput);
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
  mobile_number: any;
  pincode: any;

}
