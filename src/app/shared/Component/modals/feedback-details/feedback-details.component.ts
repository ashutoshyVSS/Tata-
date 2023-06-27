import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feedback-details',
  templateUrl: './feedback-details.component.html',
  styleUrls: ['./feedback-details.component.scss']
})
export class FeedbackDetailsComponent implements OnInit {
  @Input() feedbackData: any;
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  goBack() {
    this.modalService.dismissAll()
  }
}
