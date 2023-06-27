import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { TestimonialService } from 'src/app/shared/Services/testimonial.service';
import { UserManagementService } from 'src/app/shared/Services/user-management.service';
import Swal from 'sweetalert2';
var $ = require("jquery");

@Component({
  selector: 'app-registration-details',
  templateUrl: './registration-details.component.html',
  styleUrls: ['./registration-details.component.scss']
})
export class RegistrationDetailsComponent implements OnInit {

  @Input() data: any;
  sub: Subscription = new Subscription();

  datas: any;

  registrationForm: FormGroup;
  showLoader: boolean = false

  roleData: any = [];
  positionData: any = [];

  lobData: any = [];
  PplData: any = []

  selectedPPL: any = [];
  finalPPL: any = [];

  isEdit: boolean = false;
  saveJson: any
  isDealer: boolean;

  constructor(private modalService: NgbModal, private UserManagementService: UserManagementService,
    private fb: FormBuilder, private testimonialservice: TestimonialService) { }

  ngOnInit(): void {
    this.buildRegisterForm('');
    this.datas = this.data
    this.getRoleList()

    this.getLob()
    if (this.datas == '' || this.datas == undefined || this.datas == null) {
      this.isEdit = false;
      this.buildRegisterForm('');
    }
    else {
      this.isEdit = true;
      this.buildRegisterForm(this.datas);
      this.getPosition(this.datas.role_id);
      this.finalPPL = this.datas.ppl_s
    }
  }

  buildRegisterForm(item) {
    this.registrationForm = this.fb.group({
      username: [item.user_name || '', Validators.required],
      first_name: [item.first_name || ''],
      last_name: [item.last_name || ''],
      email_id: [item.email_id || '', Validators.email],
      phone_number: [item.contact_no || '', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      role_id: [item.role_id, Validators.required],
      position_id: [item.position_id, Validators.required],
      distributor_code: [item.distributor_code || ''],
      userid: [item.userid || ''],
      is_active: [item.is_active],
      ppl_id: [item.is_active],
      dealerCode:['']
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

  getPosition(row) {
    if (this.isEdit) {
      var Json = {
        "role_id": row
      }
    }
    else {
      var Json = {
        "role_id": row.role_id
      }
    }

    if(Json.role_id == 2){
      this.isDealer = true;
      this.registrationForm.controls['dealerCode'].setValidators(Validators.required);
    }
    else{
      this.isDealer = false;
      this.registrationForm.controls['dealerCode'].setValidators(null);
    }
    this.registrationForm.controls['dealerCode'].updateValueAndValidity();

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

  getLob() {
    try {
      this.lobData = []
      this.PplData =[]
      this.testimonialservice.GetLobList({ sub_lob_name: '' }).subscribe(response => {
        if (response.success) {
          this.lobData = response.data
        }
        else {
          this.lobData = []
        }
      }, () => {
      });
    } catch (error) {
    }
  }

  getPPL(value) {
    var Json = { "lob_name": value.lob }

    this.testimonialservice.GetPplList(Json).subscribe(
      data => {
        if (data.success == true) {
          this.PplData = data.data;
        }
        else {
        }
      }, (err) => {
      }
    );
  }

  selectPPl(value) {
    this.selectedPPL = value
  }

  addPPL() {
    for (let entry3 of this.selectedPPL) {
      var data = this.finalPPL.filter(book => book === entry3.lob);
      if (data.length == 0) {
        this.finalPPL.push(entry3.lob)
      }
    }
    this.positionData = []
    this.selectedPPL = []
    this.getLob();

  }

  onRemovePPL(type) {
    this.finalPPL.splice(this.finalPPL.findIndex(item => type === type), 1)
  }

  goBack() {
    this.modalService.dismissAll()
  }

  tabClick(flag) {
    if (flag == 'basicInfo') {
      $('#basicInfo').removeClass('show active');
      $('#basicInfo-tab').removeClass('active');
      $('#ppl').addClass('show active');
      $('#ppl-tab').addClass('active');
    }
    else if (flag == 'ppl') {
      const DstCodeValidator = this.registrationForm.get('distributor_code');
      if (this.registrationForm.value.role_id == 1) {
        DstCodeValidator.setValidators(null);
        DstCodeValidator.updateValueAndValidity();
      }
      else {
        DstCodeValidator.setValidators([Validators.required]);
        DstCodeValidator.updateValueAndValidity();
      }
      if (this.registrationForm.invalid) {
        Swal.fire('Please fill all Mandatory Details');
        return;
      }
      if (!this.isEdit) {
      this.saveRegistration()
      }
      else{
        this.UpdateRegistration()
      }
    }
    else {
      $('#basicInfo').addClass('show active');
      $('#basicInfo-tab').addClass('active');
      $('#ppl').removeClass('show active');
      $('#ppl-tab').removeClass('active');
    }
  }

  saveRegistration() {
    try {
        this.saveJson = {
          "username": this.registrationForm.value.username,
          "role_id": this.registrationForm.value.role_id,
          "first_name": this.registrationForm.value.first_name,
          "phone_number": this.registrationForm.value.phone_number,
          "email_id": this.registrationForm.value.email_id,
          "last_name": this.registrationForm.value.last_name,
          "position_id": this.registrationForm.value.position_id,
          "distributor_code": this.registrationForm.value.distributor_code,
          "is_active": this.registrationForm.value.is_active,
          "ppl_s": this.finalPPL,
          "userid": '',
        }
      this.showLoader = true
      this.sub.add(this.UserManagementService.registrationSave(this.saveJson).subscribe(
        data => {
          if (data.success == true) {
            Swal.fire({
              title: 'Added Successfully!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.registrationForm.reset();
                this.showLoader = false
                this.modalService.dismissAll()
              }
              else {
                this.registrationForm.reset();
                this.showLoader = false
                this.modalService.dismissAll()
              }
            })
          }
          else {
            this.showLoader = false
            Swal.fire(data.data.msg)
          }
        }, (err) => {
          this.showLoader = false
        }
      ));
    } catch (error) {
      this.showLoader = false
    }
  }

  UpdateRegistration() {
    try {
        this.saveJson = {
          // "username": this.registrationForm.value.username,
          "role_id": this.registrationForm.value.role_id,
          "first_name": this.registrationForm.value.first_name,
          "phone_number": this.registrationForm.value.phone_number,
          "email_id": this.registrationForm.value.email_id,
          "last_name": this.registrationForm.value.last_name,
          "position_id": this.registrationForm.value.position_id,
          "distributor_code": this.registrationForm.value.distributor_code,
          "is_active": this.registrationForm.value.is_active,
          "ppl_s": this.finalPPL,
          "account_pk": this.registrationForm.value.userid,
          "action_type": "update_account"
        }
      this.showLoader = true
      this.sub.add(this.UserManagementService.registrationUpdate(this.saveJson).subscribe(
        data => {
          if (data.success == true) {
            Swal.fire({
              title: 'Update Successfully!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.registrationForm.reset();
                this.showLoader = false
                this.modalService.dismissAll()
              }
              else {
                this.registrationForm.reset();
                this.showLoader = false
                this.modalService.dismissAll()
              }
            })
          }
          else {
            this.showLoader = false
            Swal.fire(data.data.msg)
          }
        }, (err) => {
          this.showLoader = false
        }
      ));
    } catch (error) {
      this.showLoader = false;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
