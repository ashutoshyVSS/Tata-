import { Component, OnInit, EventEmitter, Output, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, Form, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LeadService } from 'src/app/shared/Services/lead.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-faq-add-edit',
  templateUrl: './faq-add-edit.component.html',
  styleUrls: ['./faq-add-edit.component.scss']
})
export class FaqAddEditComponent implements OnInit {

  sub: Subscription = new Subscription();
  faqForm: FormGroup;
  // @Output() filterInput = new EventEmitter<any>();
  @Input() flag: any;
  @Input() data: any;
  constructor(private fb: FormBuilder, private leadService: LeadService, private modalService: NgbModal) { }

  ngOnInit(): void {

    if (this.flag == 'EDIT') {
      this.buildFAQForm(this.data);
    }
    else {
      this.buildFAQForm('');
    }

  }

  buildFAQForm(row) {
    // console.log(row.is_active);

    this.faqForm = this.fb.group({
      // referenceId: ['', [Validators.required]],
      question: [row.question || '', [Validators.required]],
      answer: [row.answer || '', [Validators.required]],
      status: [row.is_active]

    })
  }

  goBack() {
    this.modalService.dismissAll()
  }

  update() {
    // console.log(this.faqForm.value);

    if (this.faqForm.invalid) {
      Swal.fire('Please enter all mandatory fields', 'Error')
      // return false
    }
    else {

      var json = {
        action_type: this.flag == 'ADD' ? 'add' : 'update',
        id: this.data.id,
        is_active: this.flag == 'ADD' ? true : this.faqForm.controls['status'].value,
        qn: this.faqForm.controls['question'].value,
        ans: this.faqForm.controls['answer'].value,
      }
      // this.loader.open()

      this.sub.add(this.leadService.FaqAddUpdate(json).subscribe(
        data => {

          if (data.success == true) {
            // this.loader.close()
            Swal.fire({
              title: json.action_type == 'add' ? 'Added Successfully!' : 'Updated Successfully!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              // this.loader.close()
              if (result.value) {
                // this.dialogRef.close()
                this.modalService.dismissAll()
                // this.reloadCurrentRoute();
              }
              else {
                // this.loader.close()
                // this.dialogRef.close()
                this.modalService.dismissAll()
                // this.reloadCurrentRoute();
              }
            })
          }
          else {
            // this.loader.close()
            Swal.fire(data.data.msg)
          }
        }
      ));
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

export class FaqUpdateData {
  action_type: string;
  qn: string;
  ans: string;
  id: number;
  is_active: boolean;
}
export class FaqAddData {
  action_type: string;
  qn: string;
  ans: string;
  is_active: boolean;
}