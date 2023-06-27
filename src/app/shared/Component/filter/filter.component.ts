import { Component, OnInit, EventEmitter, Output, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { FilterService } from '../../Services/filter.service';
import { TestimonialService } from '../../Services/testimonial.service';
import { UserManagementService } from 'src/app/shared/Services/user-management.service';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  public AllFilters: any = FormGroup;
  @Input() filterFields: any;
  @Input() Filterarray: any = [];
  @Output() filterInput = new EventEmitter<any>();
  ShowCustom: any = false;
  dateRadioVal: any;
  from_date: any;
  to_date: any;
  submitFormWithCustomDate: boolean = false;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @Output() excelDownloadEmit = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  lobData: any;
  PPLData: any;
  PLData: any;
  selectedLOB: any;
  selectedPPL: any;
  statusData: any;
  roleData = [];
  positionData = [];
  tagsData = [];
  orderStatusData = [
    { id: 'Request Accepted', name: "Request Accepted" },
    { id: 'Request In-Process', name: "Request In-Process" },
    { id: 'Request Cancelled', name: "Request Cancelled" },
    { id: 'Payment Confirmed', name: "Payment Confirmed" },
    { id: 'Payment Faile', name: "Payment Failed" },
    { id: 'C0 (Prospectin', name: "C0 (Prospecting)" },
    { id: 'C1 (Quote Tendered)', name: "C1 (Quote Tendered)" },
    { id: 'C1A (Papers submitted)', name: "C1A (Papers submitted)" },
    { id: 'C2 (Adv. Received)', name: "C2 (Adv. Received)" },
    { id: 'C3 (Vehicle Delivered)', name: "C3 (Vehicle Delivered)" },
    { id: 'Closed Lost at C0', name: "Closed Lost at C0" },
    { id: 'Closed Lost at C1', name: "Closed Lost at C1" },
    { id: 'Closed Lost at C1A', name: "Closed Lost at C1A" },
    { id: 'Closed Lost at C2', name: "Closed Lost at C2" },
    { id: 'aborted', name: "aborted" },
    { id: 'PENDING', name: "PENDING" }
  ]

  testDriveStatus = [
    { id: 'Pending', name: "Pending" },
    { id: 'Request Accepted', name: "Request Accepted" },
    { id: 'Request In-Process', name: "Request In-Process" },
    { id: 'Request Cancelled', name: "Request Cancelled" },
    { id: 'C0 (Prospecting)', name: "C0 (Prospecting)" },
    { id: 'C1 (Quote Tendered)', name: "C1 (Quote Tendered)" },
  ]

  vehicleStatusData = [
    { id: 'DISAPPROVED', name: "DISAPPROVED" },
    { id: 'APPROVED', name: "APPROVED" },
    { id: 'PENDING', name: "PENDING" }
  ]
  productList: any = [];
  modelList: any = [];

  callBackStatus = [
    { id: 'Request Accepted', name: 'Request Accepted' },
    { id: 'Interested', name: 'Interested' },
    { id: 'Not interested', name: 'Not interested' },
    { id: 'Interested/ opty existing', name: 'Interested/ opty existing' },
    { id: 'Non contactable', name: 'Non contactable' },
    { id: 'System Closure', name: 'System Closure' },
    { id: 'OUT of territory leads', name: 'OUT of territory leads' },
  ]
  callBackActionType = [
    { name: "General Enquiry" },
    { name: "Enquiry Popup" },
  ]

  callBackProductList = [
    { name: "ICV 10T - 12T", value: "ICV 10T - 12T" },
    { name: "Intra", value: "Intra" },
    { name: "LCV 6T", value: "LCV 6T" },
    { name: "Pickup Large", value: "Pickup Large" },
    { name: "MAV Tippers 35", value: "MAV Tippers 35" },
    { name: "Tractor Trailer 52/55", value: "Tractor Trailer 52/55" },
    { name: "Tractor Trailer 39.5", value: "Tractor Trailer 39.5" },
    { name: "LCV Buses", value: "LCV Buses" },
    { name: "ICV Buses", value: "ICV Buses" },
    { name: "ICV 8T - 9T", value: "ICV 8T - 9T" },
    { name: "MAV Tippers 28", value: "MAV Tippers 28" },
    { name: "MAV 35", value: "MAV 35" },
    { name: "Tata Ace", value: "Tata Ace" },
    { name: "MAV 49", value: "MAV 49" },
    { name: "M&HCV Buses", value: "M&HCV Buses" },
    { name: "Tractor Trailer 46", value: "Tractor Trailer 46" },
    { name: "MAV 28", value: "MAV 28" },
    { name: "Winger", value: "Winger" },
    { name: "Tractor Trailer 55", value: "Tractor Trailer 55" },
    { name: "MCV Tippers 19", value: "MCV Tippers 19" },
    { name: "MAV Tippers 48", value: "MAV Tippers 48" },
    { name: "MAV Tippers 42", value: "MAV Tippers 42" },
    { name: "MCV LPT 19", value: "MCV LPT 19" },
    { name: "ICV 13T - 14T", value: "ICV 13T - 14T" },
    { name: "ICV 15T - 16T", value: "ICV 15T - 16T" },
    { name: "MAV 42", value: "MAV 42" },
    { name: "ICV Tipper", value: "ICV Tipper" },
    { name: "LCV 4T PU", value: "LCV 4T PU" },
    { name: "LCV 5T", value: "LCV 5T" },
    { name: "LCV Tippers", value: "LCV Tippers" },
    { name: "LCV 7T", value: "LCV 7T" },
    { name: "MAV 48", value: "MAV 48" },
    { name: "Magic M2", value: "Magic M2" },
    { name: "MCV SE", value: "MCV SE" },
    { name: "Tractor Trailer 30", value: "Tractor Trailer 30" },
    { name: "MAV 31", value: "MAV 31" },
  ]

  bannerStatus = [
    { name: "ACTIVE", value: "True" },
    { name: "INACTIVE", value: "False" },
  ]

  bannerPriority = [
    { name: "1th Priority", value: "1" },
    { name: "2nd Priority", value: "2" },
    { name: "3rd Priority", value: "3" },
    { name: "4th Priority", value: "4" },
    { name: "5th Priority", value: "5" },
    { name: "6th Priority", value: "6" },
  ]

  bannerPage = [
    { name: "HOME", value: "HOME" },
    { name: "EXPLORE", value: "EXPLORE" },
    { name: "FINANCE", value: "FINANCE" },
  ]
  bannerSubLob = [
    { name: "Buses", value: "Buses" },
    { name: "Icv Trucks", value: "Icv Trucks" },
    { name: "SCV Pickups", value: "SCV Pickups" },
  ]

  bannerlobData = []

  blogTypeofBlogData = [
    { name: "Image", value: "IMAGE BASED" },
    { name: "Video", value: "VIDEO BASED" },
  ]

  blogType = [
    { name: "BLOG", value: "Blog" },
    { name: "NEWS", value: "News" },
    { name: "VIDEOS", value: "Videos" },
  ]

  blogStatusData = [
    { name: "ACTIVE", value: "APPROVED" },
    { name: "INACTIVE", value: "DISAPPROVED" },
  ]

  priorityData = [
    { name: "1", value: "1" },
    { name: "2", value: "2" },
    { name: "3", value: "3" },
    { name: "4", value: "4" },
    { name: "5", value: "5" },
  ];

  constructor(private fb: FormBuilder, private datePipe: DatePipe, 
    private filterService: FilterService, private testimonialService: TestimonialService, private UserManagementService: UserManagementService,) { }

  ngOnInit(): void {
    this.buildFilterForm();
    this.onDateUpdate("");
    if (this.filterFields.LOB) {
      this.getLOBMaster('');
    }
    this.getRoleList()
    if (this.filterFields.product || this.filterFields.testDriveModel) {
      this.getProdModel('ppl');
      this.getProdModel('model');
    }
    if (this.filterFields.blogTags) {
      this.getTagList()
    }
    if (this.filterFields.callBackProduct) {
      this.productList = this.callBackProductList
    }
    if (this.filterFields.testDriveStatus) {
      this.statusData = this.testDriveStatus
    }
    else if (this.filterFields.callBackStatus) {
      this.statusData = this.callBackStatus
    }
    else if (this.filterFields.orderStatus) {
      this.statusData = this.orderStatusData
    }
    else if (this.filterFields.vehicleStatus) {
      this.statusData = this.vehicleStatusData
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  buildFilterForm() {
    this.AllFilters = this.fb.group({
      from_date: [''],
      to_date: [''],
      LOB: [],
      PPL: [],
      PL: [],
      status: [],
      fromDate: [],
      toDate: [],
      requestId: [],
      dateType: [],
      mobileNumber: [],
      vehicleNumber: [],
      city: [],
      pincode: [],
      product: [],
      testDriveModel: [],
      // testDriveStatus: [],
      leadReferenceId: [],
      callBackActionType: [],
      source: [],
      medium: [],
      campaign: [],
      keyword: [],
      campaignId: [],
      content: [],
      term: [],
      title: [],
      rating: [],
      vcNumber: [],
      model: [],
      priceLessThan: [],
      designation: [],
      customerName: [],
      createdby: [],
      bannerStatus: [],
      bannerPriority: [],
      bannerPages: [],
      bannerSubLob: [],
      bannerLob: [],
      registrationRole: [],
      registrationPosition: [],
      registrationStatus: [],
      registrationFName: [],
      registrationLName: [],
      registrationUName: [],
      blogStatus: [],
      blogType: [],
      blogTags: [],
      blogTitle: [],
      blogTypeofBlog: [],
      blogPriority: [],
    })
  }

  onDateUpdate(val: any) {
    let date = new Date();
    let fromDate: any;
    let toDate: any;
    this.ShowCustom = false;
    this.dateRadioVal = val;
    if (val == 'today') {
      toDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      fromDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    } else if (val == 'week') {
      toDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      fromDate = this.datePipe.transform(date.setDate(date.getDate() - 7), 'yyyy-MM-dd');
    } else if (val == 'month') {
      toDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      fromDate = this.datePipe.transform(date.setMonth(date.getMonth() - 1), 'yyyy-MM-dd');
    } else if (val == 'quarter') {
      toDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      fromDate = this.datePipe.transform(date.setMonth(date.getMonth() - 3), 'yyyy-MM-dd');
    } else if (val == 'year') {
      toDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      fromDate = this.datePipe.transform(date.setMonth(date.getMonth() - 12), 'yyyy-MM-dd');
    }
    else if (val == 'custom') {
      this.ShowCustom = true;
    }
    else {
      toDate = ''
      fromDate = '';
    }
    this.from_date = fromDate;
    this.to_date = toDate
  }

  getDatepickerChangeVal(val) {
    if (val == 'from_date') {
      this.from_date = this.onDateSelect(this.AllFilters.controls['from_date'].value);
    } else if (val == 'to_date') {
      this.to_date = this.onDateSelect(this.AllFilters.controls['to_date'].value);
    }
  }


  onDateSelect(val) {
    if (val != null && val != undefined && val != "") {
      let year = val.year;
      let month = val.month <= 9 ? '0' + val.month : val.month;;
      let day = val.day <= 9 ? '0' + val.day : val.day;;
      let finalDate = year + "-" + month + "-" + day;
      return finalDate;
    } else {
      return undefined;
    }
  }

  excelDownload() {
    this.excelDownloadEmit.emit()
  }

  refreshPage() {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will refresh the entire page and reset all filters.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetFilter()
      } else {
      }
    })
  }

  resetFilter() {
    this.ShowCustom = false;
    // this.from_date = localStorage.getItem('FromDate');
    // this.to_date = localStorage.getItem('ToDate');
    this.from_date = '';
    this.to_date = '';
    this.submitFormWithCustomDate = false;
    this.AllFilters.reset();
    let req: dropdowns = new dropdowns();
    req.offset = 0;
    req.limit = 10;
    req.action_type = 'drp_account'
    // this.getCustomerList(req)
    this.Filterarray = [];
    this.search('');
  }

  search(search: string) {
    if (search) {
      if (this.AllFilters.controls[search].value == '' || this.AllFilters.controls[search].value == null) {
        this.AllFilters.controls[search].setValue('')
      }
    }

    if (this.ShowCustom == true && !this.submitFormWithCustomDate) {
      this.dateUpdateUniversal();
    }

    if ((this.ShowCustom == true && this.submitFormWithCustomDate == true) || !this.ShowCustom) {
      let req: FilterInput = new FilterInput();
      req.from_date = this.from_date ? this.from_date : '';
      req.to_date = this.to_date ? this.to_date : '';
      req.request_id = this.AllFilters.value.requestId ? this.AllFilters.value.requestId : ''
      req.LOB = this.AllFilters.value.LOB ? this.AllFilters.value.LOB : ''
      req.PPL = this.AllFilters.value.PPL ? this.AllFilters.value.PPL : ''
      req.PL = this.AllFilters.value.PL ? this.AllFilters.value.PL : ''
      req.orderStatus = this.AllFilters.value.status ? this.AllFilters.value.status : ''
      req.mobileNumber = this.AllFilters.value.mobileNumber ? this.AllFilters.value.mobileNumber : ''
      req.vehicleNumber = this.AllFilters.value.vehicleNumber ? this.AllFilters.value.vehicleNumber : ''
      req.city = this.AllFilters.value.city ? this.AllFilters.value.city : ''
      req.pincode = this.AllFilters.value.pincode ? this.AllFilters.value.pincode : ''
      req.product = this.AllFilters.value.product ? this.AllFilters.value.product : ''
      req.model = this.AllFilters.value.testDriveModel ? this.AllFilters.value.testDriveModel : ''
      req.testDriveStatus = this.AllFilters.value.status ? this.AllFilters.value.status : ''
      req.leadReferenceId = this.AllFilters.value.leadReferenceId ? this.AllFilters.value.leadReferenceId : ''
      req.callBackActionType = this.AllFilters.value.callBackActionType ? this.AllFilters.value.callBackActionType : ''
      req.callBackStatus = this.AllFilters.value.status ? this.AllFilters.value.status : ''
      req.source = this.AllFilters.value.source ? this.AllFilters.value.source : ''
      req.medium = this.AllFilters.value.medium ? this.AllFilters.value.medium : ''
      req.campaign = this.AllFilters.value.campaign ? this.AllFilters.value.campaign : ''
      req.keyword = this.AllFilters.value.keyword ? this.AllFilters.value.keyword : ''
      req.campaignId = this.AllFilters.value.campaignId ? this.AllFilters.value.campaignId : ''
      req.content = this.AllFilters.value.content ? this.AllFilters.value.content : ''
      req.term = this.AllFilters.value.term ? this.AllFilters.value.term : ''
      req.title = this.AllFilters.value.title ? this.AllFilters.value.title : ''
      req.rating = this.AllFilters.value.rating ? this.AllFilters.value.rating : ''
      req.vcNumber = this.AllFilters.value.vcNumber ? this.AllFilters.value.vcNumber : ''
      req.model = this.AllFilters.value.model ? this.AllFilters.value.model : ''
      req.priceLessThan = this.AllFilters.value.priceLessThan ? this.AllFilters.value.priceLessThan : ''
      req.vehicleModel = this.AllFilters.value.model ? this.AllFilters.value.model : ''
      req.vehicleStatus = this.AllFilters.value.status ? this.AllFilters.value.status : ''
      req.designation = this.AllFilters.value.designation ? this.AllFilters.value.designation : ''
      req.customerName = this.AllFilters.value.customerName ? this.AllFilters.value.customerName : ''
      req.createdby = this.AllFilters.value.createdby ? this.AllFilters.value.createdby : ''
      req.bannerStatus = this.AllFilters.value.bannerStatus ? this.AllFilters.value.bannerStatus : ''
      req.bannerPriority = this.AllFilters.value.bannerPriority ? this.AllFilters.value.bannerPriority : ''
      req.bannerPages = this.AllFilters.value.bannerPages ? this.AllFilters.value.bannerPages : ''
      req.bannerLob = this.AllFilters.value.bannerLob ? this.AllFilters.value.bannerLob : ''
      req.bannerSubLob = this.AllFilters.value.bannerSubLob ? this.AllFilters.value.bannerSubLob : ''

      req.registrationRole = this.AllFilters.value.registrationRole ? this.AllFilters.value.registrationRole : ''
      req.registrationPosition = this.AllFilters.value.registrationPosition ? this.AllFilters.value.registrationPosition : ''
      req.registrationStatus = this.AllFilters.value.registrationStatus ? this.AllFilters.value.registrationStatus : ''
      req.registrationFName = this.AllFilters.value.registrationFName ? this.AllFilters.value.registrationFName : ''
      req.registrationLName = this.AllFilters.value.registrationLName ? this.AllFilters.value.registrationLName : ''
      req.registrationUName = this.AllFilters.value.registrationUName ? this.AllFilters.value.registrationUName : ''
      req.registrationRoleName = this.roleName ? this.roleName : ''
      req.registrationPositionName = this.positionName ? this.positionName : ''
      req.blogStatus = this.AllFilters.value.blogStatus ? this.AllFilters.value.blogStatus : ''
      req.blogType = this.AllFilters.value.blogType ? this.AllFilters.value.blogType : ''
      req.blogTags = this.AllFilters.value.blogTags ? this.AllFilters.value.blogTags : ''
      req.blogTitle = this.AllFilters.value.blogTitle ? this.AllFilters.value.blogTitle : ''
      req.priority = this.AllFilters.value.blogPriority ? this.AllFilters.value.blogPriority : ''
      req.type_of_blog = this.AllFilters.value.blogTypeofBlog ? this.AllFilters.value.blogTypeofBlog : ''

      this.filterInput.emit(req);
      this.myDrop.close();
    }
  }

  dateUpdateUniversal() {
    if (this.from_date == null || this.from_date == undefined || this.from_date == "") {
      this.from_date = "";
      Swal.fire('Select From Date');
    } else if (this.to_date == null || this.to_date == undefined || this.to_date == "") {
      this.to_date = "";
      Swal.fire('Select To Date');
    } else {
      var d1 = Date.parse(this.datePipe.transform(this.from_date));
      var d2 = Date.parse(this.datePipe.transform(this.from_date));
      let totalDifferenceInDate = Math.floor((Date.UTC(new Date(this.to_date).getFullYear(), new Date(this.to_date).getMonth(), new Date(this.to_date).getDate()) - Date.UTC(new Date(this.from_date).getFullYear(), new Date(this.from_date).getMonth(), new Date(this.from_date).getDate())) / (1000 * 60 * 60 * 24));
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
      } else if (totalDifferenceInDate > 90) {
        Swal.fire('Please select the date range up to  90 days.');
      }
      else {
        this.from_date = this.from_date;
        this.to_date = this.to_date;
        this.submitFormWithCustomDate = true;
      }
    }
  }

  removeNewlines(event, val, str: string = null,) {
    if (!str) { str = event.clipboardData.getData('text/plain'); }
    str = str.replace(/\s{2,}/g, ' ');
    str = str.replace(/\t/g, ' ');
    str = str.toString().trim().replace(/(\r\n|\n|\r)/g, '');
    this.AllFilters.controls[val].setValue(str);
    event.preventDefault();
  }

  onRemoveFilter(filterString) {
    console.log(filterString);
    if (filterString.Key == "request_id") {
      this.AllFilters.get('requestId').setValue('');
    } else if (filterString.Key == "from_date") {
      this.AllFilters.get("fromDate").setValue("");
      this.AllFilters.get("toDate").setValue("");
      this.from_date = '';
      this.to_date = '';
      this.AllFilters.get('dateType').setValue("");
      this.submitFormWithCustomDate = false;
      this.ShowCustom = false;
    }
    else if (filterString.Key == "lob" || filterString.Key == "lob_name") {
      this.AllFilters.get("LOB").setValue(null);
      this.AllFilters.get("bannerLob").setValue(null);
    }
    else if (filterString.Key == "ppl" || filterString.Key == "product" || filterString.Key == "ppl_name") {
      this.AllFilters.get("PPL").setValue(null);
      this.AllFilters.get("product").setValue(null);
    }
    else if (filterString.Key == "pl" || filterString.Key == "pl_name") {
      this.AllFilters.get("PL").setValue(null);
    }
    else if (filterString.Key == "opty_status" || filterString.Key == "status") {
      this.AllFilters.get("status").setValue(null);
      this.AllFilters.get("registrationStatus").setValue(null);
      this.AllFilters.get("blogStatus").setValue(null);
    }
    else if (filterString.Key == "mobile_number" || filterString.Key == "mobile") {
      this.AllFilters.get("mobileNumber").setValue(null);
    }
    else if (filterString.Key == "vehicle_number") {
      this.AllFilters.get("vehicleNumber").setValue(null);
    }
    else if (filterString.Key == "city") {
      this.AllFilters.get("city").setValue(null);
    }
    else if (filterString.Key == "pincode") {
      this.AllFilters.get("pincode").setValue(null);
    }
    else if (filterString.Key == "lead_ref_id") {
      this.AllFilters.get("leadReferenceId").setValue(null);
    }
    else if (filterString.Key == "model") {
      this.AllFilters.get("testDriveModel").setValue(null);
      this.AllFilters.get("model").setValue(null);
    }
    else if (filterString.Key == "action_type") {
      this.AllFilters.get("callBackActionType").setValue(null);
    }
    else if (filterString.Key == "source") {
      this.AllFilters.get("source").setValue(null);
    }
    else if (filterString.Key == "medium") {
      this.AllFilters.get("medium").setValue(null);
    }
    else if (filterString.Key == "campaign") {
      this.AllFilters.get("campaign").setValue(null);
    }
    else if (filterString.Key == "keyword") {
      this.AllFilters.get("keyword").setValue(null);
    }
    else if (filterString.Key == "campaign_id") {
      this.AllFilters.get("campaignId").setValue(null);
    }
    else if (filterString.Key == "content") {
      this.AllFilters.get("content").setValue(null);
    }
    else if (filterString.Key == "term") {
      this.AllFilters.get("term").setValue(null);
    }
    else if (filterString.Key == "category") {
      this.AllFilters.get("title").setValue(null);
    }
    else if (filterString.Key == "rating") {
      this.AllFilters.get("rating").setValue(null);
    }
    else if (filterString.Key == "vc") {
      this.AllFilters.get("vcNumber").setValue(null);
    }
    else if (filterString.Key == "models") {
      this.AllFilters.get("model").setValue(null);
    }
    else if (filterString.Key == "price") {
      this.AllFilters.get("priceLessThan").setValue(null);
    }
    else if (filterString.Key == "designation") {
      this.AllFilters.get("designation").setValue(null);
    }
    else if (filterString.Key == "name") {
      this.AllFilters.get("customerName").setValue(null);
    }
    else if (filterString.Key == "created_by_user_name") {
      this.AllFilters.get("createdby").setValue(null);
    }
    else if (filterString.Key == "is_active") {
      this.AllFilters.get("bannerStatus").setValue(null);
    }
    else if (filterString.Key == "priority") {
      this.AllFilters.get("bannerPriority").setValue(null);
      this.AllFilters.get("blogPriority").setValue(null);
    }
    else if (filterString.Key == "page") {
      this.AllFilters.get("bannerPages").setValue(null);
    }
    else if (filterString.Key == "sub_lob") {
      this.AllFilters.get("bannerSubLob").setValue(null);
    }
    else if (filterString.Key == "role_id") {
      this.AllFilters.get("registrationRole").setValue(null);
      this.roleName = "";
    }
    else if (filterString.Key == "position_id") {
      this.AllFilters.get("registrationPosition").setValue(null);
      this.positionName = "";
    }
    else if (filterString.Key == "first_name") {
      this.AllFilters.get("registrationFName").setValue(null);
    }
    else if (filterString.Key == "last_name") {
      this.AllFilters.get("registrationLName").setValue(null);
    }
    else if (filterString.Key == "user_name") {
      this.AllFilters.get("registrationUName").setValue(null);
    }
    else if (filterString.Key == "type") {
      this.AllFilters.get("blogType").setValue(null);
    }
    else if (filterString.Key == "tag") {
      this.AllFilters.get("blogTags").setValue(null);
    }
    else if (filterString.Key == "title") {
      this.AllFilters.get("blogTitle").setValue(null);
    }
    else if (filterString.Key == "type_of_blog") {
      this.AllFilters.get("blogTypeofBlog").setValue(null);
    }
    
    this.search('');
  }

  getLOBMaster(value) {

    var Json = { "sub_lob_name": value }

    this.sub.add(this.filterService.LOBList(Json).subscribe(
      data => {
        if (data.success == true) {
          this.lobData = data.data;
        }
        else {
        }
      }, (err) => {

      }

    ))
  }

  getPPLData(value) {

    var Json = { "lob_name": value }

    this.sub.add(this.filterService.PPLList(Json).subscribe(
      data => {
        if (data.success == true) {
          this.PPLData = data.data;
        }
        else {
        }
      }, (err) => {

      }

    ))
  }

  getPLData(lobValue, pplValue) {

    var Json = { "lob_name": lobValue, "ppl_name": pplValue }

    this.sub.add(this.filterService.PLLIST(Json).subscribe(
      data => {
        if (data.success == true) {
          this.PLData = data.data;
        }
        else {

        }
      }, (err) => {

      }

    ))
  }
  getProdModel(action_type) {
    let data = {
      "action_type": action_type
    }
    this.sub.add(this.filterService.TestDriveProdModelFilterDropdown(data).subscribe(
      data => {
        if (data.success) {
          if (action_type == 'ppl') {
            this.productList = data.data;
            for (let i = 0; i < this.productList; i++) {
              this.productList.push({ name: this.productList[i] })
            }
          }
          else if (action_type == 'model') {
            this.modelList = data.data
            for (let i = 0; i < this.modelList; i++) {
              this.modelList.push({ name: this.modelList[i] })
            }
          }
        }
        else {
          this.productList = [];
          this.modelList = [];
        }
      }, (err) => {

        this.productList = [];
        this.modelList = [];
      }
    ))
  }

  onChangeType(event, flag) {
    // console.log(event);
    if (flag == 'LOB') {
      this.selectedLOB = event.lob;
      this.getPPLData(this.selectedLOB)
    }
    else if (flag == 'PPL') {
      this.selectedPPL = event.lob
      this.getPLData(this.selectedLOB, this.selectedPPL)
    }
    else if (flag == 'PL') {

    }
    // console.log('selectedLOB', this.selectedLOB);
    // console.log('selectedPPL', this.selectedPPL);


  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  OnchageSubLob(event) {
    this.testimonialService.GetLobList({ sub_lob_name: event.name }).subscribe(response => {
      if (response.success) {
        this.bannerlobData = response.data
      }
      else {
        this.bannerlobData = []
      }
    }, () => {
    });
  }

  getRoleList() {
    this.roleData = [];
    this.UserManagementService.getRole('').subscribe(
      data => {
        if (data.success == true) {
          this.roleData = data.data;
        }
        else {
        }
      }, (err) => {
      }
    );
  }

  positionName: any;
  roleName: any;
  getPosition(row) {
    this.roleName = row.role_name
    var Json = {
      "role_id": row.role_id
    }
    this.UserManagementService.getPostionList(Json).subscribe(
      data => {
        if (data.success == true) {
          this.positionData = data.data;
        }
        else {
        }
      }, (err) => {
      }
    );
  }

  getPositionName(row) {
    this.positionName = row.position_name;
  }


  getTagList() {
    this.tagsData = []
    this.UserManagementService.getTag().subscribe(response => {
      if (response.success) {
        var tempdata = []
        for (var i = 0; i < response.data.length; i++) {
          var json = {
            'name': response.data[i]
          }
          tempdata.push(json)
        }
        this.tagsData = tempdata
      }
      else {
        this.tagsData = []
      }
    }, () => {
    });
  }
}

export class FilterInput {
  from_date: string;
  to_date: string;
  request_id: string
  LOB: any
  PPL: any
  PL: any
  orderStatus: any
  mobileNumber: any
  vehicleNumber: any
  city: any
  pincode: any
  product: any;
  model: any;
  leadReferenceId: any;
  testDriveStatus: any;
  callBackActionType: any;
  callBackStatus: any;
  source: any;
  medium: any;
  campaign: any;
  keyword: any;
  campaignId: any;
  content: any;
  term: any;
  title: any;
  rating: any;
  vcNumber: any;
  priceLessThan: any;
  vehicleModel: any;
  vehicleStatus: any;
  designation: any;
  customerName: any;
  createdby: any;
  bannerStatus: any;
  bannerPriority: any;
  bannerPages: any;
  bannerSubLob: any;
  bannerLob: any;
  registrationRole: any;
  registrationPosition: any;
  registrationStatus: any;
  registrationFName: any;
  registrationLName: any;
  registrationUName: any;
  registrationRoleName: any;
  registrationPositionName: any;
  blogStatus: any;
  blogType: any;
  blogTags: any;
  blogTitle: any;
  priority: any;
  type_of_blog: any;
}

export class dropdowns {
  offset: number
  limit: number
  action_type: string
}
