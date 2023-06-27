import { DatePipe, } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ExcelService } from 'src/app/shared/Services/excel.service';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AsyncApiService } from 'src/app/shared/Services/async-api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-report-download-popup',
  templateUrl: './report-download-popup.component.html',
  styleUrls: ['./report-download-popup.component.scss']
})
export class ReportDownloadPopupComponent implements OnInit {
  @Input() data: any;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @Input() pageName: any;
  @Input() count: any;
  @Input() fileType: any;
  pendingcount: any = 0;
  TemparrayALL: any = [];
  stopExcelDownload: boolean = false;
  constructor(private modalService: NgbModal, private asyncApi: AsyncApiService,
    private excelService: ExcelService, private router: Router, private datepipe: DatePipe) { }

  ngOnInit(): void {
    if (this.pageName == "LeadList") {
      this.leadListDownload();
    }
    else if (this.pageName == "TestDriveList") {
      this.testDriveListDownload();
    }
    else if (this.pageName == "CallBackList") {
      this.callBackListDownload();
    }
  }

  async leadListDownload() {
    try {
      this.TemparrayALL = [];
      this.pendingcount = 0;
      this.data.offset = 0;
      this.data.size = 250;
      let val = await this.asyncApi.exportLeadList(this.data);
      let data: any = await lastValueFrom(val);
      while (data.data.length > 0 && !this.stopExcelDownload) {
        for (let entry of data.data) {
          const Input: leadList = {} as leadList;
          Input.Request_Id = entry.request_id
          Input.First_Name = entry.first_name
          Input.Last_Name = entry.last_name
          Input.Email_Id = entry.email_id
          Input.Mobile_Number = entry.mobile_number
          Input.Amount = entry.amount
          Input.Fee = entry.fee
          Input.Tax = entry.tax
          Input.Currency = entry.currency
          Input.Status = entry.status
          Input.Card_Number = entry.card_number
          Input.Method = entry.method
          Input.To_Account_Id = entry.to_account_id
          Input.Vehicle_Description = entry.vehicle_description
          Input.Error_Source = entry.error_source
          Input.Error_Code = entry.error_code
          Input.Error_Description = entry.error_description
          Input.Amount_Refund = entry.amount_refund
          Input.Refund_Status = entry.refund_status
          Input.Razor_Pay_Order_Id = entry.razor_pay_order_id
          Input.Razor_Pay_Payment_Id = entry.razor_pay_payment_id
          Input.Portal_Order_Id = entry.portal_order_id
          Input.Wallet = entry.wallet
          Input.Sales_Stage = entry.sales_stage
          Input.Sales_Id = entry.sales_id
          Input.Payment_On = this.datepipe.transform(entry.payment_on, 'dd-MM-yyyy hh:mm:ss a')
          Input.Request_Created_On = this.datepipe.transform(entry.request_created_on, 'dd-MM-yyyy hh:mm:ss a')
          Input.Request_Created_OnSort = entry.request_created_on
          Input.Organization_Name = entry.organization_name
          Input.Dealer_State = entry.dealer_state
          Input.Dealer_Division_Id = entry.dealer_division_id
          Input.Dealer_Code = entry.dealer_code
          Input.Dealer_City = entry.dealer_city
          Input.Division_City = entry.division_city
          Input.Dealer_Lob = entry.dealer_lob
          Input.Dealer_Area = entry.dealer_area
          Input.Division = entry.division
          Input.Model = entry.model
          Input.Product_Description = entry.product_description
          Input.VC_Number = entry.vc_number
          Input.LOB = entry.lob
          Input.PPL = entry.ppl
          Input.PL = entry.pl
          Input.Price = entry.price
          Input.Booking_Amount = entry.booking_amount
          Input.Medium = entry.medium
          Input.Campaign = entry.campaign
          Input.Keyword = entry.keyword
          Input.CampaignId = entry.campaign_id
          Input.Content = entry.content
          Input.Term = entry.term
          Input.Source = entry.source
          this.TemparrayALL.push(Input)
        }

        this.data.offset = this.data.offset + 250;
        this.data.size = this.data.size + 250;
        val = await this.asyncApi.exportLeadList(this.data);
        data = await lastValueFrom(val);
        if (!data.data.length && !this.stopExcelDownload) {
          this.leadList(true, 'CancelRegister');
        } else {
          this.leadList(false, 'CancelRegister');
        }
      }
      if (this.data.offset == 0 && !data.data.length) {
        Swal.fire('No Data for downloading')
        this.modalService.dismissAll();
      }
    } catch (error) {
      Swal.fire(error.error.data.msg)
      this.modalService.dismissAll();
      console.log(error)
    }
  }

  leadList(isDownload, excel_name) {
    this.pendingcount = this.TemparrayALL.length;
    if (isDownload == true) {
      this.excelService.exportAsExcelFile(this.TemparrayALL, this.fileType);
      this.modalService.dismissAll();
    }
  }

  async testDriveListDownload() {
    try {
      this.TemparrayALL = [];
      this.pendingcount = 0;
      this.data.offset = 0;
      this.data.size = 250;

      // var rou = (Math.ceil(this.count / 250));
      // for (let i = 0; i < rou; i++) {
      // }

      let val = await this.asyncApi.exportTestDriveList(this.data);
      let data: any = await lastValueFrom(val);
      while (data.data.length > 0 && !this.stopExcelDownload) {
        for (let entry of data.data) {
          const Input: ExportData = {} as ExportData;
          Input.Name = entry.name
          Input.Mobile_Number = entry.mobile_number
          Input.Product = entry.product.ppl
          Input.Model = entry.product.model
          Input.Pincode = entry.pincode
          Input.LeadRefID = entry.lead_ref_id
          Input.Status = entry.status
          Input.Scheduled_date = this.datepipe.transform(entry.scheduled_on, 'dd-MM-yyyy')
          Input.Created_date = this.datepipe.transform(entry.created_date, 'dd-MM-yyyy hh:mm a')
          Input.First_Updated_date = this.datepipe.transform(entry.first_updated_at, 'dd-MM-yyyy hh:mm:a')
          Input.Last_Updated_date = this.datepipe.transform(entry.updated_date, 'dd-MM-yyyy hh:mm:a')
          Input.TAT = entry.first_updated_at !== '' ? this.calculateDiff(entry.first_updated_at, entry.created_date) : ''
          this.TemparrayALL.push(Input)
        }

        this.data.offset = this.data.offset + 250;
        this.data.size = this.data.size + 250;
        val = await this.asyncApi.exportTestDriveList(this.data);
        data = await lastValueFrom(val);
        if (!data.data.length && !this.stopExcelDownload) {
          this.testDriveList(true, 'CancelRegister');
        } else {
          this.testDriveList(false, 'CancelRegister');
        }
      }
      if (this.data.offset == 0 && !data.data.length) {
        Swal.fire('No Data for downloading')
        this.modalService.dismissAll();
      }
    } catch (error) {
      Swal.fire(error.error.data.msg)
      this.modalService.dismissAll();
      console.log(error)
    }
  }

  calculateDiff(first_updated_at, created_Date) {
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

  testDriveList(isDownload, excel_name) {
    this.pendingcount = this.TemparrayALL.length;
    if (isDownload == true) {
      this.excelService.exportAsExcelFile(this.TemparrayALL, this.fileType);
      this.modalService.dismissAll();
    }
  }

  async callBackListDownload() {
    try {
      this.TemparrayALL = [];
      this.pendingcount = 0;
      this.data.offset = 0;
      this.data.size = 250;

      // var rou = (Math.ceil(this.count / 250));
      // for (let i = 0; i < rou; i++) {
      // }

      let val = await this.asyncApi.exportCallBackTestDriveList(this.data);
      let data: any = await lastValueFrom(val);
      while (data.data.length > 0 && !this.stopExcelDownload) {
        for (let entry of data.data) {
          const Input: ExportCallBackData = {} as ExportCallBackData;
          Input.Mobile = entry.mobile
          Input.Name = entry.first_name + ' ' + entry.last_name
          Input.Product = entry.product
          Input.Pincode = entry.pincode
          Input.Action_Type = entry.action_type
          Input.Status = entry.status
          Input.Lead_Ref_Id = entry.lead_ref_id
          Input.Created_date = this.datepipe.transform(entry.created_date, 'dd-MM-yyyy hh:mm a')
          Input.First_Updated_date = this.datepipe.transform(entry.first_updated_at, 'dd-MM-yyyy hh:mm:a')
          Input.Last_Updated_date = this.datepipe.transform(entry.updated_date, 'dd-MM-yyyy hh:mm:a')
          Input.TAT = entry.first_updated_at !== '' ? this.calculateDiff(entry.first_updated_at, entry.created_date) : ''
          this.TemparrayALL.push(Input)
        }

        this.data.offset = this.data.offset + 250;
        this.data.size = this.data.size + 250;
        val = await this.asyncApi.exportCallBackTestDriveList(this.data);
        data = await lastValueFrom(val);
        if (!data.data.length && !this.stopExcelDownload) {
          this.callBackListDownloadList(true, 'CancelRegister');
        } else {
          this.callBackListDownloadList(false, 'CancelRegister');
        }
      }
      if (this.data.offset == 0 && !data.data.length) {
        Swal.fire('No Data for downloading')
        this.modalService.dismissAll();
      }
    } catch (error) {
      Swal.fire(error.error.data.msg)
      this.modalService.dismissAll();
      console.log(error)
    }
  }

  callBackListDownloadList(isDownload, excel_name) {
    this.pendingcount = this.TemparrayALL.length;
    if (isDownload == true) {
      this.excelService.exportAsExcelFile(this.TemparrayALL, this.fileType);
      this.modalService.dismissAll();
    }
  }
  closeModal() {
    this.modalService.dismissAll();
    this.stopExcelDownload = true;
  }
}

export class leadList {
  Request_Created_OnSort: string
  Request_Id: string
  First_Name: string;
  Last_Name: string;
  Email_Id: string;
  Mobile_Number: string;
  Amount: string;
  Fee: string;
  Tax: string;
  Currency: string;
  Status: string;
  Card_Number: string;
  Method: string;
  To_Account_Id: string;
  Vehicle_Description: string;
  Error_Source: string;
  Error_Code: string;
  Error_Description: string;
  Amount_Refund: string;
  Refund_Status: string;
  Razor_Pay_Order_Id: string;
  Razor_Pay_Payment_Id: string;
  Portal_Order_Id: string;
  Wallet: string;
  Sales_Stage: string;
  Sales_Id: string;
  Payment_On: string;
  Request_Created_On: string;
  Organization_Name: string;
  Dealer_State: string;
  Dealer_Division_Id: string;
  Dealer_Code: string;
  Dealer_City: string;
  Division_City: string;
  Dealer_Lob: string;
  Dealer_Area: string;
  Division: string;
  Model: string;
  Product_Description: string;
  VC_Number: string;
  LOB: string;
  PPL: string;
  PL: string;
  Price: string;
  Booking_Amount: string;
  Medium: string;
  Campaign: string;
  Keyword: string
  CampaignId: string
  Content: string
  Term: string
  Source: string;
}

export class ExportData {
  Mobile: string
  Name: string
  Model: string
  Product: string
  Created_date: string
  First_Updated_date: string
  Last_Updated_date: string
  TAT: any
  Pincode: string
  LeadRefID: string
  Status: string
  Scheduled_date: string
  Mobile_Number: string
}

export class ExportCallBackData {
  Mobile: string
  Name: string
  Product: string
  Model: string
  Campaign_Name: string
  Status: string
  Lead_Ref_Id: string
  Created_date: string
  First_Updated_date: string
  Last_Updated_date: string
  TAT: any
  Pincode: string
  Action_Type: string
}