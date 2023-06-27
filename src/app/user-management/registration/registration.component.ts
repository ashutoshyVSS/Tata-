import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { UserManagementService } from 'src/app/shared/Services/user-management.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  @ViewChild('registration', { read: TemplateRef, static: false }) registration: TemplateRef<any>;
  
  sub: Subscription = new Subscription();
  ActiveMenu: any;
  showLoader: boolean = false;
  pagevalid: any;

  filterInputData: any;
  filterFields: any;
  Filterarray: any;
  closeResult: any;

  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;

  registrationList = []
  rowData: any;
  roleName:any;

  constructor(private datapass: DataPassService, private UserManagementService: UserManagementService,
    private datePipe: DatePipe, private router: Router,private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('RolePageMapping')
    if (this.pagevalid) {
      this.filterFields = {
        "registrationRole": true,
        "registrationPosition": true,
        "registrationStatus": true,
        "registrationFName": true,
        "registrationLName": true,
        "registrationUName": true,
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      const ListInput: ListInput = {} as ListInput;
      ListInput.offset = 0;
      this.getRegistrationList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getRegistrationList(ListInput) {
    this.FilterStrings(ListInput);
    this.showLoader = true;
    this.sub.add(this.UserManagementService.registrationList(ListInput).subscribe(
      data => {
        this.showLoader = false;
        if (data.success == true) {
          this.totalrecord = data.range_info.total_row;
          this.registrationList = data.data;
          this.showLoader = false;
        }
        else {
          this.totalrecord = 0
          this.registrationList = [];
          this.showLoader = false;
        }
      }, (err) => {
        this.totalrecord = 0;
        this.registrationList = [];
        this.showLoader = false;
      }
    ));
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
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'status');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'position_id');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'role_id');

    if (ListInput.status) {
      if (ListInput.status == true) {
        var Json1 = { "Key": 'is_active', "Value": 'Active' }
      }
      else {
        var Json1 = { "Key": 'is_active', "Value": 'Inactive' }
      }
      this.Filterarray.push(Json1)
    }

    if (this.roleName) {
      var Json = { "Key": 'role_id', "Value": this.roleName }
      this.Filterarray.push(Json)
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
    const ListInput: ListInput = {} as ListInput;
    ListInput.offset = page;
    // ListInput.Pagenumber = page
    ListInput.position_id = this.filterInputData?.registrationPosition;
    ListInput.role_id = this.filterInputData?.registrationRole;
    ListInput.position = this.filterInputData?.registrationPositionName;
    ListInput.distributor_code = this.filterInputData?.bannerLob;
    ListInput.first_name = this.filterInputData?.registrationFName;
    ListInput.last_name = this.filterInputData?.registrationLName;
    ListInput.user_name = this.filterInputData?.registrationUName;
    ListInput.status = this.filterInputData?.registrationStatus;
    this.roleName =  this.filterInputData?.registrationRoleName;
    // if(this.filterInputData?.registrationPositionName){

    // }
    this.getRegistrationList(ListInput);
  }

  openPopup(row, flag) {
    this.rowData = row

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'dark-modal'
    };
    this.modalService.open(this.registration, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      const ListInput: ListInput = {} as ListInput;
      ListInput.offset = 0;
      this.getRegistrationList(ListInput);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

export class ListInput {
  offset: number;
  account_type: string;
  status: string;
  user_name: string;
  contact_no: string;
  email_id: string;
  first_name: string;
  last_name: string;
  distributor_code: string;
  position: string;
  position_id: string;
  role_id: string;
}
