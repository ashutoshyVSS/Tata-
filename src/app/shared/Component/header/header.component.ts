import { DatePipe } from '@angular/common';
import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbDatepicker, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {AuthorizeService} from './../../Services/authorize.service';
import { CommonService } from './../..//Services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor( private datepipe: DatePipe,
    private router: Router, private modalService: NgbModal,
    private auth: AuthorizeService,
    private route: ActivatedRoute,private CommonService: CommonService) { }

    loginData: any;
    fromdate:any;
    todate:any;
    frmmodel:any;
    Tomodel:any;
    pagedetails:any = [];
    tab: any = 1;
    date:any
  ngOnInit(): void {
    this.fromdate = localStorage.getItem("FromDate");
    this.todate = localStorage.getItem("ToDate");
    if(this.fromdate && this.todate){
      this.frmmodel = this.toDate(this.fromdate);
      this.Tomodel = this.toDate(this.todate);
    }
    var list = JSON.parse(localStorage.getItem('PageDetails') || "")
    this.pagedetails = list;
    if(localStorage.getItem('tab')){
      this.tab = Number(localStorage.getItem('tab')) ;
    }
    this.loginData = JSON.parse(localStorage.getItem('loginData') || "")
    this.CommonService.tabValue.subscribe(
      res =>{
        this.tab = res
      }
    )
  }

  open1(content:any) {
    this.modalService.open(content);
  }

  onClick(check:any, row:any) {
    // console.log(check,row);
    this.tab = check
    let page: any;
    if(row.MenuHeaderName == "Dashboard"){
      page = "pages/Dashboard"
      localStorage.setItem('subMenu','')
    }else{
      page = "pages/" + row.page_detail[0]?.page_url
      localStorage.setItem('subMenu',row.page_detail[0].page_detail_id)
    }
    var Pagemasterid = row.page_master_id;
    localStorage.setItem('tab',row.page_master_id)
    this.CommonService.tabValue.next(this.tab)
    this.router.navigate([page], { queryParams: { page: Pagemasterid } });
  }

  closeResult = '';
  modalRef2: any;
  open(content:any) {
    this.modalRef2 = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  dateUpdateUniversal(val?:any){
    this.modalService.dismissAll();
    if(val=='save'){
      this.frmmodel = this.onDateSelect(this.frmmodel);
      this.Tomodel = this.onDateSelect(this.Tomodel);
      localStorage.setItem('isUniversalDate','True')
      if(this.frmmodel== null && this.frmmodel==undefined ){
        Swal.fire('Select From Date');
      }else if(this.Tomodel == null && this.Tomodel ==undefined ){
        Swal.fire('Select To Date');
      }else{
        var d1 = Date.parse((this.datepipe.transform(this.frmmodel)) || "");
        var d2 = Date.parse((this.datepipe.transform(this.Tomodel)) || "");
        let totalDifferenceInDate =  Math.floor(( Date.UTC(new Date(this.Tomodel).getFullYear(), new Date(this.Tomodel).getMonth(), new Date(this.Tomodel).getDate()) -  Date.UTC( new Date(this.frmmodel).getFullYear(), new Date(this.frmmodel).getMonth(), new Date(this.frmmodel).getDate()) ) /(1000 * 60 * 60 * 24));
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
        }else if(totalDifferenceInDate >95){
          Swal.fire('Please select the date range up to  95 days.');
        }else {
          this.fromdate = this.frmmodel;
          this.todate = this.Tomodel;
          localStorage.setItem("ToDate", this.todate);
          localStorage.setItem("FromDate", this.fromdate);
        }
      }
    }else{
      var d = new Date(); // today!  
      var x = new Date(d.getFullYear(), d.getMonth(), 1); // today!      
      this.fromdate = this.datepipe.transform(x, 'yyyy-MM-dd')
      this.todate = this.datepipe.transform(d, 'yyyy-MM-dd')
      localStorage.setItem("ToDate", this.todate);
      localStorage.setItem("FromDate", this.fromdate);
      localStorage.removeItem('isUniversalDate')
    }
    this.onRefresh();
  }

  
  onDateSelect(val:any) {
    if(val!=null && val!=undefined && val!=""){
      let year = val.year;
      let month = val.month <= 9 ? '0' + val.month : val.month;;
      let day = val.day <= 9 ? '0' + val.day : val.day;;
      let finalDate = year + "-" + month + "-" + day;
      return finalDate;
    }else{
      return undefined;
    }
  }

  Logout(){
  this.auth.loggedOut()
  localStorage.clear();
  this.modalService.dismissAll()
  }

  onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
    let currentUrl = this.router.url.split('?')[0] ;
    let pageParam:any;
    this.route.queryParams.subscribe(params => {
      pageParam = params['page'];
    });
  //  this.tab = pageParam
   if(localStorage.getItem('tab')){
    this.tab = Number(localStorage.getItem('tab')) ;
  }
   this.CommonService.tabValue.next(this.tab)
    this.router.navigateByUrl(currentUrl+"?page="+pageParam)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate( [currentUrl], { queryParams:{page:pageParam} });
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

  logo(){
    this.router.navigate(['pages/Dashboard']);
    let pageDetails = JSON.parse(localStorage.getItem('PageDetails') || '');
    let tabDetail = pageDetails.find((e:any) => e.MenuHeaderName == 'Dashboard')
    this.tab = tabDetail.page_master_id
    localStorage.setItem('tab',this.tab)
    this.CommonService.tabValue.next(this.tab)
    localStorage.setItem('subMenu',tabDetail.page_detail[0].page_detail_id)
 }

 toDate(dob:any) {
  if (dob) {
    const [year, month, day] = dob.split('-');
    const obj = { year: parseInt(year), month: parseInt(month), day: 
    parseInt(day.split(' ')[0].trim()) };
    return obj;
  }else{
    return undefined;
  }
}

}
