import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { FeatureService } from 'src/app/shared/Services/feature.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {
  sub: Subscription = new Subscription();
  pagevalid: any;
  ActiveMenu: any;
  showLoader: boolean = false;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;
  featureList: any = [];
  @ViewChild('bulkUpload', { read: TemplateRef, static: false }) bulkUpload: TemplateRef<any>;
  closeResult: string;
  constructor(private datapass: DataPassService, private router: Router, private featureService: FeatureService, private datePipe: DatePipe, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('FeatureList')
    if (this.pagevalid) {
      // this.filterFields = {
      //   "vehicleSearch": true,
      //   "LOB": true,
      //   "PPL": true,
      //   "PL": true,
      //   "vehicleStatus": true,
      //   "date": true,
      //   "vehicleNumber": true,
      //   "model": true,
      //   "priceLessThan": true,
      //   // "excelDownload": true,
      // }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.currentPage = 1
      this.noofrecordsperpage = 10;
      this.showRecords = 10;
      const ListInput: Input = {} as Input;
      ListInput.ppl = '';
      ListInput.vc_number = '';
      ListInput.category = "feature";
      // ListInput.start_row = 0;
      // ListInput.end_row = 10;
      this.getFeatureList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getFeatureList(ListInput: any) {
    try {
      this.showLoader = true;
      this.totalrecord = 0;
      // this.FilterStrings(ListInput);
      this.sub.add(this.featureService.getFeatureList(ListInput).subscribe(
        result => {
          if (result.success) {
            this.featureList = result?.data;
            this.totalrecord = result?.total_records;
            this.showRecords = (((this.currentPage * 10) - 10) + result?.data?.length);
            this.showLoader = false;
          }
          else {
            this.featureList = [];
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

  openPopup(flag, data) {
    // this.rowData = data;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true
    };
    if (flag == 'ADD') {
      this.modalService.open(this.bulkUpload, ngbModalOptions).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        const ListInput: Input = {} as Input;
        ListInput.start_row = 0;
        ListInput.end_row = 10;
        ListInput.category = "feature";
        this.getFeatureList(ListInput);
      }, (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else {

      this.modalService.open(this.bulkUpload, ngbModalOptions).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
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
  pageChange(page: any, pageChange) {
    // console.log(page);

    this.currentPage = page;
    // page = page - 1;
    const ListInput: Input = {} as Input;
    // ListInput.offset = page;
    // ListInput.limit = this.noofrecordsperpage;
    if (pageChange) {
      ListInput.end_row = (page * 10);
      ListInput.start_row = (page * 10) - 10;
    }
    ListInput.category = "feature";

    this.getFeatureList(ListInput);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
export class Input {
  offset: any;
  limit: any;
  category: any;
  price: any
  from_date: any
  to_date: any
  ppl: any
  pl_name: any
  lob_name: any
  model: any
  vc_number: any
  status: any
  end_row: any
  start_row: any
}