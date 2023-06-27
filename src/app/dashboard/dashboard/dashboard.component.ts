import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/shared/Services/common.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  sub: Subscription = new Subscription();
  pagevalid: any;
  ActiveMenu: any;
  showLoader: boolean = false;
  dashboardData: any;
  filterFields: any;
  Filterarray: any = [];
  filterInputData: any;
  constructor(private CommonService: CommonService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getDashboardData('');
    this.filterFields = {
      // "leadSearch": true,
      "LOB": true,
      "PPL": true,
      "PL": true,
      "orderStatus": true,
      "date": true,
      // "excelDownload": true,
    }
  }

  getDashboardData(ListInput) {
    try {
      this.showLoader = true;
      this.FilterStrings(ListInput);
      this.sub.add(this.CommonService.Dashboard(ListInput).subscribe(
        result => {
          if (result.success) {
            this.dashboardData = result.data
            console.log(this.dashboardData)
            this.showLoader = false;
          }
          else {
            this.dashboardData = [];
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
    const ListInput: Input = {} as Input;
    ListInput.from_date = this.filterInputData.from_date;
    ListInput.to_date = this.filterInputData.to_date;
    ListInput.pl = this.filterInputData.PL;
    ListInput.ppl = this.filterInputData.PPL;
    ListInput.lob = this.filterInputData.LOB;
    // ListInput.division_id = this.filterInputData.
    ListInput.opty_status = this.filterInputData.orderStatus;
    // this.pageChange(1)
    this.getDashboardData(ListInput)
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

export class Input {
  from_date: any;
  to_date: any;
  pl: any;
  ppl: any;
  lob: any;
  division_id: any; 
  opty_status: any;
}
