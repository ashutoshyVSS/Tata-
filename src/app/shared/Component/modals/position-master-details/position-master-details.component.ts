import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { UserManagementService } from 'src/app/shared/Services/user-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-position-master-details',
  templateUrl: './position-master-details.component.html',
  styleUrls: ['./position-master-details.component.scss']
})
export class PositionMasterDetailsComponent implements OnInit {

  @Input() data: any;
  @Input() roleData: any;
  sub: Subscription = new Subscription();

  showLoader: boolean = false

  positionForm: FormGroup;
  datas: any;
  btnLabel: any

  constructor(private fb: FormBuilder, private modalService: NgbModal, private UserManagementService: UserManagementService) { }

  ngOnInit(): void {
    this.datas = this.data;

    if (this.datas == '' || this.datas == undefined || this.datas == null) {
      this.btnLabel = 'Submit';
      this.buildForm('');
    }
    else {
      this.btnLabel = 'Update';
      this.buildForm(this.datas);
    }
  }

  buildForm(row) {
    this.positionForm = this.fb.group({
      role_id: [row.role_id || '', Validators.required],
      position_name: [row.position_name || '', Validators.required],
      position_id: ['' || ''],
    })
  }

  saveAndUpdate() {
    if (this.positionForm.invalid) {
      return;
    }
    var json
    if (this.btnLabel == 'Submit') {
      json = {
        "status": 'insert',
        "role_id": this.positionForm.value.role_id,
        "position_id": '',
        "position_name": this.positionForm.value.position_name,
      }
    }
    else {
      json = {
        "status": 'update',
        "role_id": this.positionForm.value.role_id,
        "position_id": this.datas.position_id,
        "position_name": this.positionForm.value.position_name,
      }
    }
    try {
      this.showLoader = true
      this.sub.add(this.UserManagementService.positionInsertUpdate(json).subscribe(
        data => {
          this.showLoader = false
          if (data.success == true) {
            Swal.fire({
              title: data.data.data.msg,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.positionForm.reset();
                this.showLoader = false
                this.modalService.dismissAll()
              }
              else {
                this.positionForm.reset();
                this.showLoader = false
                this.modalService.dismissAll()
              }
            })
          }
          else {
            this.showLoader = false
            Swal.fire(data.data.data.msg);
          }
        }, (err) => {
          this.showLoader = false
          Swal.fire('Exception Occured!');
        }
      ));
    } catch (error) {
      this.showLoader = false
    }
  }

  goBack() {
    this.modalService.dismissAll()
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
