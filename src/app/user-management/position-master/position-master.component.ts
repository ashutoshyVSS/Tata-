import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataPassService } from 'src/app/shared/Services/data-pass.service';
import { UserManagementService } from 'src/app/shared/Services/user-management.service';

@Component({
  selector: 'app-position-master',
  templateUrl: './position-master.component.html',
  styleUrls: ['./position-master.component.scss']
})
export class PositionMasterComponent implements OnInit {

  @ViewChild('positionMaster', { read: TemplateRef, static: false }) positionMaster: TemplateRef<any>;

  sub: Subscription = new Subscription();
  ActiveMenu: any;
  showLoader: boolean = false
  pagevalid: any;

  positionData = [];
  roleData = []
  closeResult: string;
  rowData: any;

  constructor(private datapass: DataPassService, private UserManagementService: UserManagementService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('Positionmaster')
    this.ActiveMenu = localStorage.getItem("subMenu");
    this.getRoleList();
  }

  getRoleList() {
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

  getTable(roleData: any) {
    var json = {
      "role_id": roleData.role_id,
      "position_name": "",
      "position_id": ""
    }
    this.GetPositionList(json)
  }

  GetPositionList(input) {
    try {
      this.positionData = [];
      this.showLoader = true;
      this.sub.add(this.UserManagementService.getPostionList(input).subscribe(
        data => {
          this.showLoader = false;
          this.positionData = data
          if (data.success == true) {
            this.positionData = data.data;
          }
          else {
            this.showLoader = false;
          }
        }, (err) => {
          this.showLoader = false;
        }
      ));
    } catch (error) {
      this.showLoader = false
    }
  }

  openPopup(row, flag) {
    this.rowData = row

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'dark-modal'
    };
    this.modalService.open(this.positionMaster, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      var json = {
        "role_id": '1',
        "position_name": "",
        "position_id": ""
      }
      this.GetPositionList(json)
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
