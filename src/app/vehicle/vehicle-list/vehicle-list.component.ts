import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { VehicleService } from 'src/app/shared/Services/vehicle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  sub: Subscription = new Subscription();
  pagevalid: any;
  ActiveMenu: any;
  showLoader: boolean = false;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;
  vehicleList: any = []
  filterInputData: any;
  filterFields: any;
  Filterarray: any;
  @ViewChild('vehicleDetail', { read: TemplateRef, static: false }) vehicleDetail: TemplateRef<any>;
  closeResult: string;
  @ViewChild('bulkUpload', { read: TemplateRef, static: false }) bulkUpload: TemplateRef<any>;
  rowData: any;

  constructor(private datapass: DataPassService, private router: Router, private vehicleService: VehicleService, private datePipe: DatePipe, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('InventoryList')
    if (this.pagevalid) {
      this.filterFields = {
        "vehicleSearch": true,
        "LOB": true,
        "PPL": true,
        "PL": true,
        "vehicleStatus": true,
        "date": true,
        "vehicleNumber": true,
        "model": true,
        "priceLessThan": true,
        // "excelDownload": true,
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.currentPage = 1
      this.noofrecordsperpage = 10;
      this.showRecords = 10;
      const ListInput: Input = {} as Input;
      // ListInput.offset = 0;
      // ListInput.limit = 10;
      ListInput.start_row = 0;
      ListInput.end_row = 10;
      this.getVehicleList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getVehicleList(ListInput: any) {
    try {
      this.showLoader = true;
      this.totalrecord = 0;
      this.FilterStrings(ListInput);
      this.sub.add(this.vehicleService.getVehicleList(ListInput).subscribe(
        result => {
          if (result.success) {
            this.vehicleList = result?.data;
            this.totalrecord = result?.range_info.total_records;
            this.showRecords = (((this.currentPage * 10) - 10) + result?.data?.length);
            this.showLoader = false;
          }
          else {
            this.vehicleList = [];
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
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'end_row');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'start_row');

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
    this.pageChange(1, false)
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

    ListInput.price = this.filterInputData?.priceLessThan
    ListInput.from_date = this.filterInputData?.from_date
    ListInput.to_date = this.filterInputData?.to_date
    ListInput.ppl_name = this.filterInputData?.PPL
    ListInput.pl_name = this.filterInputData?.PL
    ListInput.lob_name = this.filterInputData?.LOB
    ListInput.model = this.filterInputData?.vehicleModel
    ListInput.vehicle_number = this.filterInputData?.vehicleNumber
    ListInput.status = this.filterInputData?.vehicleStatus

    this.getVehicleList(ListInput);
  }

  checkstatus(value) {
    var status
    // status = value == "PENDING" || value == "DISAPPROVED" ? true : false
    if (value == "PENDING" || value == "DISAPPROVED") {
      status = true
    }
    else {
      status = false
    }
    return status;
  }

  // openPopup(flag) {

  // }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openPopup(flag, data) {
    // this.leadId = row.id
    this.rowData = data;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true
      
    };
    if (flag == 'ADD') {
      this.modalService.open(this.vehicleDetail, ngbModalOptions).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        const ListInput: Input = {} as Input;
        ListInput.start_row = 0;
        ListInput.end_row = 10;
        this.getVehicleList(ListInput);
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
        ListInput.product_id = row.id
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
        ListInput.product_id = row.id
        this.ApproveReject(ListInput)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  ApproveReject(ListInput) {
    this.vehicleService.ApproveRejectVehicle(ListInput).subscribe(
      data => {
        if (data.success == true) {
          const ListInput: Input = {} as Input;
          ListInput.start_row = 0;
          ListInput.end_row = 10;
          ListInput.price = this.filterInputData?.priceLessThan
          ListInput.from_date = this.filterInputData?.from_date
          ListInput.to_date = this.filterInputData?.to_date
          ListInput.ppl_name = this.filterInputData?.PPL
          ListInput.pl_name = this.filterInputData?.PL
          ListInput.lob_name = this.filterInputData?.LOB
          ListInput.model = this.filterInputData?.vehicleModel
          ListInput.vehicle_number = this.filterInputData?.vehicleNumber
          ListInput.status = this.filterInputData?.vehicleStatus
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
              this.getVehicleList(ListInput);
            }
            else {
              this.getVehicleList(ListInput);
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

  updateVehicleList(value, rowData, flag) {
    var json = {
      "vc_number_list":[rowData.vehicle_number],
      "is_home_brand":rowData.is_home_brand == true? 'active':'in_active',
      "is_popular":rowData.is_popular == true? 'active':'in_active',
      "is_new_launch":rowData.is_new_launch == true? 'active':'in_active'
    }
    if(flag == 'home'){
      json.is_home_brand = value;
    }
    else if(flag == 'popular'){
      json.is_popular = value;
    }
    else if(flag == 'newLaunch'){
      json.is_new_launch = value;
    }
    try {
      this.sub.add(this.vehicleService.updateVehicleList(json).subscribe(
        result => {
          if (result.success) {
            this.showLoader = false;
            this.pageChange(this.currentPage, false)
          }
          else {
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

export class Input {
  offset: any;
  limit: any;

  price: any
  from_date: any
  to_date: any
  ppl_name: any
  pl_name: any
  lob_name: any
  model: any
  vehicle_number: any
  status: any

  end_row: any
  start_row: any
}

export class AprroveRejectJson {
  status: string;
  product_id: number;
}
