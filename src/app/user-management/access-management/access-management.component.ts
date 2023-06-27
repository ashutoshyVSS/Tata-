import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { UserManagementService } from 'src/app/shared/Services/user-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.scss']
})
export class AccessManagementComponent implements OnInit {

  sub: Subscription = new Subscription();
  ActiveMenu: any;
  showLoader: boolean = false;
  pagevalid: any;

  public accessForm: FormGroup;

  roleData: any = [];
  positionData: any = [];
  masterData = [];
  selectedPages: any = [];

  totalrecord: number = 0;

  constructor(private datapass: DataPassService, private UserManagementService: UserManagementService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('RegistrationList')
    this.ActiveMenu = localStorage.getItem("subMenu");
    this.buildAccessForm()
    this.getRoleList()
  }

  buildAccessForm() {
    this.accessForm = this.fb.group({
      role_id: [],
      position_id: [],
    })
  }

  getRoleList() {
    this.roleData = [];
    this.sub.add(this.UserManagementService.getRole('').subscribe(
      data => {
        if (data.success == true) {
          this.roleData = data.data;
        }
        else {
        }
      }, (err) => {
      }
    ));
  }

  getPosition(row) {
    var Json = {
      "role_id": row.role_id
    }
    this.sub.add(this.UserManagementService.getPostionList(Json).subscribe(
      data => {
        if (data.success == true) {
          this.positionData = data.data;
        }
        else {
        }
      }, (err) => {
      }
    ));
  }

  getAccessTable(event) {
    this.getMasterData()
  }

  getMasterData() {
    try {
      this.masterData = [];
      this.showLoader = true;
      var input = this.accessForm.value;

      this.sub.add(this.UserManagementService.getPagemasterData(input).subscribe(data => {
        this.showLoader = true;
        if (data.success == true) {
          this.showLoader = false;
          this.masterData = data.data;
          this.totalrecord = data.data.length;
          for (let i = 0; i < this.masterData.length; i++) {
            if (this.masterData[i].page_status == true) {
              this.selectedPages.push({ page_detail_id: this.masterData[i].page_master_detail_id, page_id: this.masterData[i].page_master_id })
            }
          }
        }
        else {
          this.showLoader = false;
          this.totalrecord = 0;
        }
      }, (err) => {
        this.showLoader = false;
        this.totalrecord = 0;
      }
      ));
    } catch (error) {
      this.showLoader = false
      this.totalrecord = 0;
    }
    // this.isDisplayTable = true
  }

  onSelectPage(row, event) {
    this.selectedPages = this.selectedPages.filter((book: any) => book.page_detail_id !== row.page_detail_id);
    if (event.target.checked) {
      this.selectedPages.push({ page_detail_id: row.page_master_detail_id, page_id: row.page_master_id })
    }
  }

  saveMaster() {
    try {
      if (this.selectedPages.length > 0) {
        var json = {
          "role_id": this.accessForm.value.role_id,
          "position_id": this.accessForm.value.position_id,
          "page_list": this.selectedPages
        }
        this.showLoader = true
        this.UserManagementService.insertPageMapping(json).subscribe(
          data => {
            this.showLoader = false
            if (data.success == true) {
              Swal.fire({
                title: 'Data Saved Successfully !',
                // text: "You won't be able to revert this!",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.value) {
                  this.showLoader = false
                  this.masterData = [];
                  this.selectedPages = [];
                  this.accessForm.reset();
                  this.getRoleList();
                }
                else {
                  this.showLoader = false
                  this.masterData = [];
                  this.selectedPages = [];
                  this.accessForm.reset();
                  this.getRoleList();
                }
              })
            }
            else {
              this.showLoader = false
            }
          }, (err) => {
            this.showLoader = false
          }
        );
      }
      else {
        this.showLoader = false
        Swal.fire('Please provide at least one access.');
      }
    } catch (error) {
      this.showLoader = false
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
