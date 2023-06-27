import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { LeadService } from 'src/app/shared/Services/lead.service';

@Component({
  selector: 'app-lead-list-details',
  templateUrl: './lead-list-details.component.html',
  styleUrls: ['./lead-list-details.component.scss']
})
export class LeadListDetailsComponent implements OnInit {
  @Input() leadId: any;
  sub: Subscription = new Subscription();
  leadDetailList: any = [];
  isDealInfo = true;
  isGeneralInfo = false;
  isSourceDetail = false;
  isPaymentInfo = false;
  isVehicleInfo = false;
  isLeadDetail: boolean = true;
  isKYCDoc: boolean = false;
  constructor(private leadService: LeadService, private modalService: NgbModal) { }

  ngOnInit(): void {
    // console.log(this.leadId);
    this.getleadDetailList(this.leadId)
  }

  getleadDetailList(leadId) {
    try {

      this.sub.add(this.leadService.getLeadDetail({ lead_id: leadId }).subscribe(
        result => {
          if (result.success) {
            this.leadDetailList = result.data[0];
          }
          else {
            this.leadDetailList = [];
            // this.showLoader = false;
          }
        }, (err) => {
          // this.showLoader = false;
        }
      ));
    } catch (error) {
      console.log(error)
    }

  }

  goBack() {
    this.modalService.dismissAll()
  }

  tabClick(flag) {
    this.isLeadDetail = false
    this.isKYCDoc = false
    this.isDealInfo = false
    this.isGeneralInfo = false
    this.isSourceDetail = false
    this.isPaymentInfo = false
    this.isVehicleInfo = false

    if (flag == 'dealerInfo') {
      this.isDealInfo = true;
    }
    else if (flag == 'sourceDetail') {
      this.isGeneralInfo = true;
    }
    else if (flag == 'paymentInfo') {
      this.isSourceDetail = true;
    }
    else if (flag == 'generalInfo') {
      this.isPaymentInfo = true;
    }
    else if (flag == 'vehicleInfo') {
      this.isVehicleInfo = true;
    }
    else if (flag == 'leadDetail') {
      this.isLeadDetail = true;
      this.isDealInfo = true;
    }
    else if (flag == 'kycDoc') {
      this.isKYCDoc = true;
    }
  }

}
