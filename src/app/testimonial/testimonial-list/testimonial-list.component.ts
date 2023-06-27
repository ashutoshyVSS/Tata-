import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { TestimonialService } from 'src/app/shared/Services/testimonial.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial-list.component.scss']
})
export class TestimonialListComponent implements OnInit {

  @ViewChild('TestimonialAddEdit', { read: TemplateRef, static: false }) TestimonialAddEdit: TemplateRef<any>;
  
  sub: Subscription = new Subscription();
  ActiveMenu: any;
  showLoader: boolean = false
  
  filterInputData: any;
  filterFields: any;
  Filterarray: any;
  closeResult: any;

  testimonialList: any = []

  pagevalid: any;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;

  flag: any;
  rowData: any;

  constructor(private datapass: DataPassService, private router: Router, private datePipe: DatePipe,
    private TestimonialService:TestimonialService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('FeedBackList')
    if (this.pagevalid) {
      this.filterFields = {
        // "referralSearch": true,
        "date": true,
        "vehicleStatus": true,
        "designation": true,
        "customerName": true,
        "createdby": true,
        // "excelDownload": true,
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.currentPage = 1
      this.noofrecordsperpage = 10;
      this.showRecords = 10;
      const ListInput: Input = {} as Input;
      ListInput.offset = 0;
      ListInput.limit = 10;
      this.getTestimonialList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getTestimonialList(ListInput: any) {
    try {
      this.showLoader = true;
      this.totalrecord = 0;
      this.FilterStrings(ListInput);
      this.sub.add(this.TestimonialService.testiominalList(ListInput).subscribe(
        result => {
          if (result.success) {
            this.testimonialList = result.data;
            this.totalrecord = result.range_info.total_count;
            this.showRecords = (((this.currentPage * 10) - 10) + result?.data?.length);
            this.showLoader = false;
          }
          else {
            this.testimonialList = [];
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
    ListInput.designation = this.filterInputData?.designation
    ListInput.name = this.filterInputData?.customerName
    ListInput.status = this.filterInputData?.callBackStatus
    ListInput.created_by_user_name = this.filterInputData?.createdby

    this.getTestimonialList(ListInput);
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
        ListInput.testimonial_id = row.id
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
        ListInput.testimonial_id = row.id
        this.ApproveReject(ListInput)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  ApproveReject(ListInput) {
    this.TestimonialService.ApproveRejectFeedbak(ListInput).subscribe(
      data => {
        if (data.success == true) {
          const ListInput: Input = {} as Input;
          ListInput.offset = 0
          // if (this.vc) {      ListInput.vc = this.vc;    }    else {      ListInput.vc = "";    }

          // if (this.model) {      ListInput.model = this.model;    }    else {      ListInput.model = "";    }

          // if (this.category) {      ListInput.category = this.category;    }    else {      ListInput.category = "";    }

          // if (this.rating) {      ListInput.rating = this.rating;   }    else {      ListInput.rating = "";    }

          // if (this.from_date) {      ListInput.from_date = this.FromDate;    }    else {      ListInput.from_date = "";    }

          // if (this.to_date) {      ListInput.to_date = this.ToDate;    }    else {      ListInput.to_date = "";    }

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
              this.getTestimonialList(ListInput);
            }
            else {
              this.getTestimonialList(ListInput);
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

  openPopup(row,flag) {
    this.flag = flag
    this.rowData = row
    
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'dark-modal'
    };
    this.modalService.open(this.TestimonialAddEdit, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      const ListInput: Input = {} as Input;
      ListInput.offset = this.currentPage - 1;
      ListInput.limit = 10;
      this.getTestimonialList(ListInput);
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

export class Input {
  offset: any;
  limit: any;
  from_date: any;
  to_date: any;
  designation: any;
  name: any
  status: any
  created_by_user_name: any
}

export class AprroveRejectJson {
  testimonial_id: number;
  status: string;
}
