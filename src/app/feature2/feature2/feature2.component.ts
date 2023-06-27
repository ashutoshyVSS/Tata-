import { Component, OnInit } from '@angular/core';
import { FeatureService } from 'src/app/shared/Services/feature.service';
import { TestimonialService } from 'src/app/shared/Services/testimonial.service';

@Component({
  selector: 'app-feature2',
  templateUrl: './feature2.component.html',
  styleUrls: ['./feature2.component.scss']
})
export class Feature2Component implements OnInit {
  data: any;
  user: any = []
  getFeatureList: any = []
  testiominalList: any = [];
  constructor(private featureservice: FeatureService, private testimonalservices: TestimonialService) { }

  ngOnInit(): void {
    this.featureservice.getFeatureList(this.data).subscribe(
      res => {
        console.log(res.data);
        this.user = res.data
        console.log(this.user);

      }
    )

    this.testimonalservices.testiominalList(this.data).subscribe(
      respo => {
        console.log(respo.data);
        this.testiominalList = respo.data



      }
    )

  }
}


