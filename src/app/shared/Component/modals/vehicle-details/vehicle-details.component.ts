import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { VehicleService } from 'src/app/shared/Services/vehicle.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { first, filter } from 'rxjs/operators';
import { FileUploadService } from 'src/app/shared/Services/file-upload/file-upload.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {
  showLoader = false;
  @Input() data: any;
  @ViewChild("myckeditor", { static: false }) myckeditor: any;
  ckeConfig: any
  public safeURL: SafeResourceUrl;
  GetAllSelectImages = [];
  AllSelectImages = [];
  SelectCoverImages = [];
  SelectNormalImages = [];
  CoverImageFile: any;
  imgsrc: any;
  panelOpenState = false;
  // ProductForm: FormGroup;
  // public itemForm: FormGroup;
  AllImageFile = [];
  ImageErrorString: any;
  ActionType: any;
  // FinalSize: any;
  DisplayVideIframe: boolean = false

  video_url_s: any = []
  video_url_sDisplay: any = []
  isTDriveActive: boolean = true;
  productId: any;
  videoURL: any = [];
  selectImages: any;
  urls = new Array<string>(); tempArr = [];
  EditFile: File;

  Filechange: any;
  video_url;
  url1;
  isfilechange: any = 'No';
  Edit: any;
  video_Display: any = [];
  url: any;
  format: any;

  public productCatForm: FormGroup;
  public productPriceForm: FormGroup;
  public overviewForm: FormGroup;
  public specsHighlightsForm: FormGroup;
  public engineForm: FormGroup;
  public fuelForm: FormGroup;
  public transmissionForm: FormGroup;
  public dimensionLoadForm: FormGroup;
  public bodyCabinForm: FormGroup;
  public wheelsForm: FormGroup;
  public comfortForm: FormGroup;
  public suspensionForm: FormGroup;
  public warrantyForm: FormGroup;
  public imageGalleryForm: FormGroup;
  public youtubeVideoForm: FormGroup;
  // public fileVideoForm: FormGroup;
  sub: Subscription = new Subscription
  lob: any;
  pl: any;
  ppl: any;
  VCNumber: boolean;
  PageTitle: string;
  isVcNumber: boolean = true;


  constructor(private modalService: NgbModal, private router: Router, private fb: FormBuilder, private _sanitizer: DomSanitizer, private vehicleService: VehicleService, private fileUpService: FileUploadService) { }

  ngOnInit(): void {
    this.ckeConfig = {
      removePlugins: 'maximize,save'
    };

    this.ActionType = ''

    if (this.data.id == '' || this.data.id == undefined || this.data.id == null) {

      this.PageTitle = "Add Vehicle";
      this.buildForms('');
      this.ActionType = 'add'
      this.VCNumber = false;
    }
    else {
      this.VCNumber = true;
      this.isVcNumber = false;
      this.ActionType = 'edit'
      this.PageTitle = "Edit VC No.:" + this.data.vehicle_number + ', Created By:' + this.data.created_by_username;
      this.Edit = "Yes"
      this.lob = this.data.lob;
      this.ppl = this.data.ppl;
      this.pl = this.data.pl;
      if (this.data.images !== null) {
        for (var i = 0; i < this.data.images.length; i++) {
          if (this.data.images[i].image_url != "") {
            this.GetAllSelectImages.push(this.data.images[i]);
            this.SelectCoverImages = this.GetAllSelectImages.filter(data => data.is_cover === true);
            if (this.SelectCoverImages.length > 0) {
              this.imgsrc = this.SelectCoverImages[0].image_url;
            }
            this.SelectNormalImages = this.GetAllSelectImages.filter(data => data.is_cover === false);
          }
          else if (this.data.images[i].video_url != "") {
            var vid_url = this._sanitizer.bypassSecurityTrustResourceUrl(this.data.images[i].video_url);
            var json1 = {
              "id": this.data.images[i].id,
              "Safurl": vid_url,
              "mainurl": this.data.images[i].video_url,
              "status": "old"
            }
            this.video_Display.push(json1)
          }
        }
      }

      if (this.data.video_url_s.length > 0) {
        for (let entry1 of this.data.video_url_s) {
          this.video_url_s.push(entry1)
          const videoId = this.getId(entry1);
          this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
          var json = {
            "Safurl": this.safeURL,
            "mainUrl": entry1,
          }
          this.video_url_sDisplay.push(json)
        }
      }
      this.AllSelectImages = this.GetAllSelectImages.filter(data => data.is_cover === false);
      this.buildForms(this.data)
      
      this.EditBindControlArray(this.AllSelectImages);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goBack() {
    this.modalService.dismissAll()
  }

  buildForms(item) {
    this.productCatForm = this.fb.group({
      sub_lob: [item.sub_lob || '', Validators.required], // vehicle Type
      vehicle_number: [item.vehicle_number || '', Validators.required],
      product_description: [item.product_description || '', Validators.required],
      model: [item.model || '', Validators.required],
      test_drive: [item.test_drive  || ''],
    })
    this.isTDriveActive = item.test_drive? true : false

    this.productPriceForm = this.fb.group({
      vehicle_application: [item.vehicle_application || ''],
      product_type: [item.product_type || ''],
      product_category: [item.product_category || ''],
      price_range: [item.price_range || ''],

    })

    this.overviewForm = this.fb.group({
      overview: [item.overview || ''],

    })

    this.specsHighlightsForm = this.fb.group({
      gvw_s: [item.gvw_s || '', Validators.required],
      max_power_s: [item.max_power_s || '', Validators.required],
      fuel_tank_capacity_s: [item.fuel_tank_capacity_s || '', Validators.required],
      engine_type_s: [item.engine_type_s || '', Validators.required],
    })

    this.engineForm = this.fb.group({
      max_power: [item.max_power || ''],
      max_torque: [item.max_torque || ''],
      emission_norms: [item.emission_norms || ''],
      engine_type: [item.engine_type || ''],
      engine_cylinders: [item.engine_cylinders || ''],
      gradeability: [item.gradeability || ''],
    })

    this.fuelForm = this.fb.group({
      fuel_tank_capacity: [item.fuel_tank_capacity || ''],
      fuel_type: [item.fuel_type || ''],
    })

    this.transmissionForm = this.fb.group({
      clutch_type: [item.clutch_type || ''],
      gearbox: [item.gearbox || ''],
    })

    this.dimensionLoadForm = this.fb.group({
      gvw: [item.gvw || ''],
      wheelbase: [item.wheelbase || ''],
      width: [item.width || ''],
      height: [item.height || ''],
      length: [item.length || ''],
    })

    this.bodyCabinForm = this.fb.group({
      cabin_type: [item.cabin_type || ''],
      load_body_length: [item.load_body_length || ''],
      load_body_type: [item.load_body_type || ''],
      load_body_dimensions: [item.load_body_dimensions || ''],
      seating_capacity_layout: [item.seating_capacity_layout || ''],
      passenger_door: [item.passenger_door || ''],
      side_windows: [item.side_windows || ''],
      hat_rack: [item.hat_rack || ''],
    })

    this.wheelsForm = this.fb.group({
      no_wheels: [item.no_wheels || ''],
      front_tyre: [item.front_tyre || ''],
      rear_tyre: [item.rear_tyre || ''],
      axle_configuration: [item.axle_configuration || ''],
    })

    this.comfortForm = this.fb.group({
      air_conditioning: [item.air_conditioning || ''],
      telematics: [item.telematics || ''],
      seat_type: [item.seat_type || ''],
      steering_type: [item.steering_type || ''],
    })

    this.suspensionForm = this.fb.group({
      rear_suspension: [item.rear_suspension || ''],
      front_suspension: [item.front_suspension || ''],
      brake_type: [item.brake_type || ''],
      hill_hold: [item.hill_hold || ''],
    })

    this.warrantyForm = this.fb.group({
      warranty: [item.warranty || ''],
    })

    this.imageGalleryForm = this.fb.group({
      ProductUploadData: this.fb.array([]),
    })

    this.youtubeVideoForm = this.fb.group({
      video_url: ['' || ''],
    })


    if (this.youtubeVideoForm.value.video_url == "") {
      this.DisplayVideIframe = false
    }
    else {
      this.DisplayVideIframe = true
      const videoId = this.getId(item.video_url);
      this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
    }

  }

  save() {

    if (this.video_url_s.length > 5) {
      Swal.fire('You have reached max no of video uploads permissible');
      return;
    }

    var formInvalid = this.isFormInvalid();
    if (formInvalid) {
      Swal.fire('Please fill all mandatory fields');
      return;
    }

    if (this.youtubeVideoForm.value.video_url) {
      var valid = this.ValidateYoutubeUrl(this.youtubeVideoForm.value.video_url);
      if (valid == false) {
        Swal.fire('Please Enter valid Youtube URL');
        return;
      }
    }

    if (this.imageGalleryForm.get('ProductUploadData').value.length != 0) {

      if (this.imgsrc == undefined || this.imgsrc == "") {
        Swal.fire('Please select Cover Image');
        return;
      }
    }

    const Json: InsertUpdatedata = {} as InsertUpdatedata;

    Json.action_type = this.ActionType
    Json.sub_lob = this.productCatForm.value.sub_lob;
    Json.lob = this.lob;
    Json.ppl = this.ppl;
    Json.pl = this.pl;
    Json.vehicle_number = this.productCatForm.value.vehicle_number;
    Json.product_description = this.productCatForm.value.product_description;
    Json.model = this.productCatForm.value.model;
    Json.test_drive = this.isTDriveActive
    Json.vehicle_application = this.productPriceForm.value.vehicle_application;
    Json.price_range = Number(this.productPriceForm.value.price_range);
    Json.product_type = this.productPriceForm.value.product_type;
    Json.product_category = this.productPriceForm.value.product_category;
    Json.overview = this.overviewForm.value.overview;
    Json.gvw_s = this.specsHighlightsForm.value.gvw_s;
    Json.max_power_s = this.specsHighlightsForm.value.max_power_s;
    Json.fuel_tank_capacity_s = this.specsHighlightsForm.value.fuel_tank_capacity_s;
    Json.engine_type_s = this.specsHighlightsForm.value.engine_type_s;
    Json.max_power = this.engineForm.value.max_power;
    Json.max_torque = this.engineForm.value.max_torque;
    Json.emission_norms = this.engineForm.value.emission_norms;
    Json.engine_type = this.engineForm.value.engine_type;
    Json.engine_cylinders = this.engineForm.value.engine_cylinders;
    Json.gradeability = this.engineForm.value.gradeability;
    Json.fuel_tank_capacity = this.fuelForm.value.fuel_tank_capacity;
    Json.fuel_type = this.fuelForm.value.fuel_type;
    Json.clutch_type = this.transmissionForm.value.clutch_type;
    Json.gearbox = this.transmissionForm.value.gearbox;
    Json.gvw = this.dimensionLoadForm.value.gvw;
    Json.wheelbase = this.dimensionLoadForm.value.wheelbase;
    Json.width = this.dimensionLoadForm.value.width;
    Json.height = this.dimensionLoadForm.value.height;
    Json.length = this.dimensionLoadForm.value.length;
    Json.cabin_type = this.bodyCabinForm.value.cabin_type;
    Json.load_body_length = this.bodyCabinForm.value.load_body_length;
    Json.load_body_type = this.bodyCabinForm.value.load_body_type;
    Json.load_body_dimensions = this.bodyCabinForm.value.load_body_dimensions;
    Json.seating_capacity_layout = this.bodyCabinForm.value.seating_capacity_layout;
    Json.side_windows = this.bodyCabinForm.value.side_windows;
    Json.hat_rack = this.bodyCabinForm.value.hat_rack;
    Json.passenger_door = this.bodyCabinForm.value.passenger_door;
    Json.no_wheels = this.wheelsForm.value.no_wheels;
    Json.front_tyre = this.wheelsForm.value.front_tyre;
    Json.rear_tyre = this.wheelsForm.value.rear_tyre;
    Json.axle_configuration = this.wheelsForm.value.axle_configuration;
    Json.air_conditioning = this.comfortForm.value.air_conditioning;
    Json.telematics = this.comfortForm.value.telematics;
    Json.seat_type = this.comfortForm.value.seat_type;
    Json.steering_type = this.comfortForm.value.steering_type;
    Json.rear_suspension = this.suspensionForm.value.rear_suspension;
    Json.front_suspension = this.suspensionForm.value.front_suspension;
    Json.brake_type = this.suspensionForm.value.brake_type;
    Json.hill_hold = this.suspensionForm.value.hill_hold;
    Json.warranty = this.warrantyForm.value.warranty;
    Json.video_url_s = this.video_url_s // this.youtubeVideoForm.value.video_url
    Json.exterior_color = '';
    Json.interior_color = '';
    Json.interior_furnishing = '';
    Json.esp_with_gst = 0;
    Json.down_payment = 0;
    // Json.year = 0;
    Json.displacement = '';
    Json.max_speed = '';
    Json.mileage = '';
    Json.battery = '';
    Json.alternator = '';
    Json.transmission = '';
    Json.kerb_weight = '';
    Json.payload = '';
    Json.rear_overhang = '';
    Json.front_overhang = '';
    Json.cargo_box_dimensions = '';
    Json.chassis_type = '';
    Json.cabin_type_day = '';
    Json.body_option = '';
    Json.body_type = '';
    Json.front_axle = '';
    Json.rear_axle = '';
    Json.turning_radius = '';
    Json.tubeless_tyres = '';
    Json.tyre_type = '';
    Json.wheel_rim = '';
    Json.ground_clearance = '';
    Json.cruise_control = '';
    Json.navigation_system = '';
    Json.tiltable_steering = '';
    Json.arm_rest = '';
    Json.power_steering = '';
    Json.driver_information_display = '';
    Json.adjustable_driver_seat = '';
    Json.abs = '';
    Json.front_breaks = '';
    Json.rear_breaks = '';
    Json.parking_breaks = '';
    Json.fuel_indicator = '';
    Json.fog_lights = '';
    Json.air_bags = '';
    Json.seat_belts = '';
    Json.engine_oil_change_interval = '';
    Json.hotspot = '';
    this.showLoader = true;
    this.sub.add(this.vehicleService.AddInventory(Json).subscribe(
      data => {
        if (data.success == true) {
          this.productId = data.data.product_id
          var Check = false;
          const formData = new FormData();
          formData.append('product_id', data.data.product_id);

          if (this.CoverImageFile != undefined) {
            Check = true;
            formData.append('cover_image', this.CoverImageFile);
          }
          else {
            // formData.append('cover_image', '');
          }
          for (let i of this.imageGalleryForm.get('ProductUploadData').value) {
            if (i.ImageType == "NEW") {
              Check = true;
              formData.append('images', i.FileName);
            }
          }
          if (Check) {
            this.sub.add(this.fileUpService.uploadImageDocument(formData).subscribe(data => {
              if (data.success) {
                if (this.videoURL.length > 0) {
                  const data1 = new FormData();
                  data1.append("product_id", this.productId);
                  data1.append("action_type", "PRODUCT");
                  for (let i of this.videoURL) {
                    data1.append("video", i);
                  }
                  this.sub.add(this.fileUpService.UploadVideo(data1).subscribe(
                    (data) => {
                      if (data.success) {
                        Swal.fire({
                          title: data.data.msg,
                          icon: 'success',
                          showCancelButton: false,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'OK'
                        }).then((result) => {
                          if (result.value) {
                            this.resetAllForms();
                            this.showLoader = false
                            this.router.navigate(['pages/InventoryList']);
                          }
                          else {
                            this.resetAllForms();
                            this.showLoader = false
                            this.router.navigate(['pages/InventoryList']);
                          }
                        })
                      } else {
                        this.showLoader = false
                        Swal.fire("UnSuccessfully saved! " + data.data.msg);
                      }
                    }
                  ));
                }
                else {
                  Swal.fire({
                    title: data.data.msg,
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    if (result.value) {
                      this.resetAllForms();
                      this.showLoader = false
                      this.router.navigate(['pages/InventoryList']);
                    }
                    else {
                      this.resetAllForms();
                      this.showLoader = false
                      this.router.navigate(['pages/InventoryList']);
                    }
                  })
                }
              }
              else {
                Swal.fire('UnSuccessfully saved! ' + data.data.msg);
                this.showLoader = false
              }
              ;
            }));
          }
          else {
            if (this.videoURL.length > 0) {
              const data1 = new FormData();
              data1.append("product_id", this.productId);
              data1.append("action_type", "PRODUCT");
              for (let i of this.videoURL) {
                data1.append("video", i);
              }
              this.sub.add(this.fileUpService.UploadVideo(data1).subscribe(
                (data) => {
                  if (data.success) {
                    Swal.fire({
                      title: data.data.msg,
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'OK'
                    }).then((result) => {
                      if (result.value) {
                        this.resetAllForms();
                        this.showLoader = false
                        this.router.navigate(['pages/InventoryList']);
                      }
                      else {
                        this.resetAllForms();
                        this.showLoader = false
                        this.router.navigate(['pages/InventoryList']);
                      }
                    })
                  } else {
                    this.showLoader = false
                    Swal.fire("UnSuccessfully saved! " + data.data.msg);
                  }
                }
              ));
            }
            else {
              Swal.fire({
                title: data.data.msg,
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.value) {
                  this.resetAllForms();
                  this.showLoader = false
                  this.router.navigate(['pages/InventoryList']);
                }
                else {
                  this.resetAllForms();
                  this.showLoader = false
                  this.router.navigate(['pages/InventoryList']);
                }
              })
            }
          }
          this.modalService.dismissAll();
        }
        else {
          this.showLoader = false
          Swal.fire(data.data.msg)
        }
      }, (err) => {
        this.showLoader = false
      }
    ));
  }

  resetAllForms() {
    this.productCatForm.reset();
    this.productPriceForm.reset();
    this.overviewForm.reset();
    this.specsHighlightsForm.reset();
    this.engineForm.reset();
    this.fuelForm.reset();
    this.transmissionForm.reset();
    this.dimensionLoadForm.reset();
    this.bodyCabinForm.reset();
    this.wheelsForm.reset();
    this.comfortForm.reset();
    this.suspensionForm.reset();
    this.warrantyForm.reset();
    this.imageGalleryForm.reset();
    this.youtubeVideoForm.reset();
    // this.fileVideoForm.reset();

    this.AllImageFile = [];
    const control = <FormArray>this.imageGalleryForm.controls['ProductUploadData'];

    this.CoverImageFile = "";
    this.imgsrc = "";
    for (let i of this.imageGalleryForm.get('ProductUploadData').value) {
      control.removeAt(i);
    }
    this.video_url_sDisplay = [];
    this.video_url_s = [];
    this.videoURL = [];
    this.video_Display = [];
  }

  isFormInvalid() {
    if (this.productCatForm.invalid || this.productPriceForm.invalid || this.overviewForm.invalid || this.specsHighlightsForm.invalid || this.engineForm.invalid || this.fuelForm.invalid || this.transmissionForm.invalid || this.dimensionLoadForm.invalid || this.bodyCabinForm.invalid || this.wheelsForm.invalid || this.comfortForm.invalid || this.suspensionForm.invalid || this.warrantyForm.invalid || this.imageGalleryForm.invalid || this.youtubeVideoForm.invalid) {
      return true;
    }
    else {
      return false;
    }

  }
  getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }
  ValidateYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
      return url.match(p)[1];
    }
    return false;
  }

  VCFocusOut() {
    if (!this.productCatForm.value.vehicle_number) {
      this.isVcNumber = true;
      Swal.fire('Please Enter VC Number.')
      return;
    }
    else{
      this.isVcNumber = false;
    }
    // if (!this.productCatForm.value.sub_lob) {
    //   Swal.fire('Please Select Vehicle type.')
    //   return;
    // }
    var Json = {
      "vc_number": this.productCatForm.value.vehicle_number
    }
    try {
      this.sub.add(this.vehicleService.GetVCDetails(Json).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            this.lob = res.data.LOB_s
            this.pl = res.data.PL_s
            this.ppl = res.data.PPL_s
          } else {
            this.productCatForm.controls['vehicle_number'].setValue('');
            this.isVcNumber = true;
            Swal.fire(res.data.msg)
            return;
          }
        },
        error: (err) => {
          Swal.fire(err.data.msg)
          return;
        }
      }
      ));
    }
    catch (err: any) {
      Swal.fire(err.data.msg)
    }
  }

  onSelectCoverImage(event) {
    this.imgsrc = "";
    if (event.target.files && event.target.files[0]) {
      var size = event.target.files[0].size;
      var AcSize = Math.round(size / 1024);
      var Extension = event.target.files[0].name.substring(
        event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
      if (Extension == 'PNG' || Extension == 'JPG' || Extension == 'jpg' || Extension == 'png') {
        const reader = new FileReader();
        const file = event.target.files[0];
        this.CoverImageFile = file;
        // alert(file.size)
        if (AcSize < 200) {
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event) => {
            let target: any = event.target;
            this.imgsrc = target.result;
          }
        }
        else {
          Swal.fire('Oops...', 'Upload only 200 KB size files!', 'error')
        }
      }
      else {

        Swal.fire('Oops...', 'Photo only allows file types of  PNG, JPG ', 'error')
      }
    }

  }

  ShowImagePopUp(Image: any) {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.hasBackdrop = true;
    // dialogConfig.data = Image;
    // dialogConfig.disableClose = false;
    // let dialogRef = this.dialog.open(ImageDetailComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {

    // });
  }

  SelectImageFiles(event) {
    this.ImageErrorString = "";
    this.urls = [];
    this.AllImageFile = [];
    let files = event.target.files;
    let duplicatefilename: boolean = false;
    if (files) {
      if (this.tempArr.length <= 4) {
        if (this.tempArr.length >= 1) {
          let filename = this.tempArr.filter(obj => {
            for (let i = 0; i < event.target.files.length; i++) {
              if (obj.name === event.target.files[i].name) {
                obj.name === event.target.files[i].name;
              }
            }
          });
          if (filename.length >= 1) {
            duplicatefilename = true;
            Swal.fire('Oops...', 'Duplicate Images not allowed', 'error');
          }
        }
        if (!duplicatefilename) {
          let availableImageToUpload = (5 - this.SelectNormalImages.length) - this.tempArr.length;
          if (files.length > availableImageToUpload) {
            Swal.fire('Oops...', 'You have reached max no of image uploads permissible', 'error')
          }
          else {
            for (let i = 0; i < event.target.files.length; i++) {
              const file = event.target.files[i];
              var name = event.target.files[i].name;
              var type = event.target.files[i].type;
              var size = event.target.files[i].size;
              var modifiedDate = event.target.files[i].lastModifiedDate;
              const lastDot = name.lastIndexOf('.');
              const Extension = name.substring(lastDot + 1);
              const Img = new Image();
              var AcSize = Math.round(size / 1024);
              Img.src = URL.createObjectURL(event.target.files[i]);
              Img.onload = (e: any) => {
                var sizes = {
                  width: Img.width,
                  height: Img.height
                };
              }
              if ((Extension == 'JPG' || Extension == 'PNG' || Extension == 'jpg' || Extension == 'png') && (AcSize <= 200)) {
                this.AllImageFile.push(file);
                this.tempArr.push(file);
                let reader = new FileReader();
                reader.onload = (e: any) => {
                  this.urls.push(e.target.result);
                }
                reader.readAsDataURL(file);
              }
              else {
                if (this.ImageErrorString == "") {
                  this.ImageErrorString = "Invalid Images  Please follow below Instruction:"
                }
                this.ImageErrorString = this.ImageErrorString + ',' + name;
              }
            }
            this.BindControlArray(this.AllImageFile);
          }
        }
      }
      else {
        Swal.fire('Oops...', 'Upload only 5 Images!', 'error')
      }
    }
  }

  get getmultipleControl() {
    return <FormArray>this.imageGalleryForm.controls['ProductUploadData'];
  }

  BindControlArray(data) {
    for (let file of data) {
      var position = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.getmultipleControl.push(this.bindValueArray(file, e.target.result, position, 'NEW', ''))
      }
    }
  }

  BindVideoArray(data) {
    // this.ProductForm.controls['ProductUploadData'] = []
    for (let file of data) {
      var position = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.getmultipleControl.push(this.bindValueArray(file, e.target.result, position, 'NEW', ''))
      }
    }
  }

  EditBindControlArray(data) {
    for (let files of data) {
      var position = "";
      this.EditFile = files.image_url;
      this.getmultipleControl.push(this.bindValueArray(files.image_url, files.image_url, position, 'OLD', files.id))

    }
  }

  bindValueArray(FileName, Base64, Postion, ImageType, id) {
    return this.fb.group(
      {
        FileImageSrc: [Base64],
        FileName: [FileName],
        ImagePositionType: [Postion || ''],
        ImageType: [ImageType],
        id: [id],
      }
    )
  }

  removeGroup(i: number) {
    const control = <FormArray>this.imageGalleryForm.controls['ProductUploadData'];
    var item = (<FormArray>this.imageGalleryForm.get('ProductUploadData')).at(i);
    var removeid = item.value.id
    if (removeid == "") {
      control.removeAt(i);
      this.tempArr = this.tempArr.filter(val => {
        return val.name !== item.value.FileName.name
      });
    }
    else {
      const ListInput: prodInput = {} as prodInput;
      ListInput.product_image_id = removeid;
      this.sub.add(this.vehicleService.Removespecificimage(ListInput).subscribe(
        data => {
          if (data.success == true) {
            control.removeAt(i);
            this.showLoader = false;
            this.SelectNormalImages = this.SelectNormalImages.filter(val => {
              return val.id !== ListInput.product_image_id
            });
          }
          else {
            Swal.fire('Please try after some time');
            this.showLoader = false;
          }
        }, (err) => {
          this.showLoader = false;
        }

      ));
    }
  }

  onBlurVideoUL(event) {
    var valid = this.ValidateYoutubeUrl(event);
    if (event) {
      if (valid != false) {
        this.DisplayVideIframe = true
        const videoId = this.getId(event);

        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
      }
      else {
        this.DisplayVideIframe = false
        Swal.fire('Please Enter valid Youtube URL');
      }
    }
  }

  AddYouTubeVideo() {
    if (this.video_url_s.length >= 5) {
      Swal.fire('You have reached max no of video uploads permissible');
      return
    }
    if (!this.youtubeVideoForm.value.video_url) {
      Swal.fire('Please Enter valid Youtube URL');
      return
    }
    var data2 = this.video_url_s.filter(book => book === this.youtubeVideoForm.value.video_url);
    if (data2.length == 0) {
      this.showLoader = true;
      var valid = this.ValidateYoutubeUrl(this.youtubeVideoForm.value.video_url);

      if (this.youtubeVideoForm.value.video_url) {
        if (valid != false) {
          // this.DisplayVideIframe = true
          const videoId = this.getId(this.youtubeVideoForm.value.video_url);

          this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
          var json = {
            "Safurl": this.safeURL,
            "mainUrl": this.youtubeVideoForm.value.video_url,
          }
          this.video_url_sDisplay.push(json)
          this.video_url_s.push(this.youtubeVideoForm.value.video_url)
          this.showLoader = false;
          this.youtubeVideoForm.get('video_url').setValue('');
        }
        else {
          this.showLoader = false;
          Swal.fire('Please Enter valid Youtube URL');
        }
      }
    }
    else {
      this.showLoader = false;
      Swal.fire('Youtube URL already Exists');
    }
  }

  RemoveYoutube(id: any, number: number) {

    Swal.fire({
      title: 'Are you sure you want to remove this video ?',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result) {
        this.video_url_sDisplay.splice(number, 1);
        this.video_url_s.splice(number, 1);
        Swal.fire("Video Removed Successfully");
      }
      else {
        this.modalService.dismissAll()
      }
    })
    // this.confirm.confirm({ message: ` Are you sure you want to remove this video ?` })
    //   .subscribe((data) => {
    //     if (data) {
    //       this.video_url_sDisplay.splice(number, 1);
    //       this.video_url_s.splice(number, 1);
    //       Swal.fire("Video Removed Successfully");
    //     }
    //   });
  }

  onSelectVideoFile(event) {

    if (this.videoURL.length <= 4) {
      if (this.video_Display.length <= 4) {
        const file = event.target.files && event.target.files[0];
        var size = event.target.files[0].size;
        if (size > 5000000) {
          Swal.fire('Upload only 5 MB size files!')
          return
        }
        if (file.type.indexOf('video') != 0) {
          Swal.fire('Upload only video files!')
          return
        }
        this.isfilechange = 'Yes'
        this.Edit = 'No'
        if (file) {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          if (file.type.indexOf('image') > -1) {
            this.format = 'image';
          } else if (file.type.indexOf('video') > -1) {
            this.format = 'video';
          }
          const file1 = event.target.files[0];
          if (this.videoURL.length >= 0) {
            for (var i = 0; i < this.videoURL.length; i++) {
              var data2 = this.videoURL[i];
              if (data2.name == file1.name) {
                Swal.fire('Video already Exists')
                return
              }
            }
          }
          this.video_url = file1;
          this.videoURL.push(this.video_url)

          reader.onload = (event) => {
            // this.url = (<FileReader>event.target).result;
            this.url1 = (<FileReader>event.target).result;
            var json = {
              "id": "",
              "Safurl": this.url1,
              "mainurl": this.video_url,
              "status": "new"
            }
            this.video_Display.push(json)
          }
        }
      }
      else {
        Swal.fire({
          icon: 'info',
          title: 'You have reached max no of video uploads permissible'
        })
      }
    }
    else {
      Swal.fire({
        icon: 'info',
        title: 'You have reached max no of video uploads permissible'
      })
    }

  }


  removeVideo(item: any, i: number) {
    Swal.fire({
      title: 'Are you sure you want to remove this video ?',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result) {
        const control = this.video_Display;
        const control1 = this.videoURL;
        if (item.id) {
          const objData: InventoryImage = {} as InventoryImage;
          objData.product_image_id = parseInt(item.id);
          this.sub.add(this.vehicleService.RemoveInventoryById(objData).pipe(first()).subscribe((res) => {
            if (res instanceof HttpErrorResponse) {
              return;
            }
            if (res.success) {
              Swal.fire("Video Removed Successfully");
            } else {
              Swal.fire(res.data.msg, "Error");
            }
          },
            (error) => {
              Swal.fire(error.error.data.msg, "Error");
            }
          ));
          control.splice(i, 1);
          this.videoURL.splice(i, 1);
        }
        else {
          control.splice(i, 1);
          control1.splice(i, 1);
          Swal.fire("Video Removed Successfully");
        }
      }
      else {
        this.modalService.dismissAll()
      }
    })
  }

}
export class InsertUpdatedata {
  action_type: string;
  sub_lob: string;
  lob: string;
  ppl: string;
  pl: string;
  vehicle_number: string;
  product_description: string;
  model: string;
  year: number;
  overview: string;
  vehicle_application: string;
  exterior_color: string;
  interior_color: string;
  interior_furnishing: string;
  price_range: number;
  esp_with_gst: number;
  down_payment: number;
  max_power: string;
  max_torque: string;
  displacement: string;
  max_speed: string;
  emission_norms: string;
  engine_type: string;
  engine_cylinders: string;
  gradeability: string;
  fuel_tank_capacity: string;
  fuel_type: string;
  mileage: string;
  battery: string;
  alternator: string;
  transmission: string;
  clutch_type: string;
  gearbox: string;
  gvw: string;
  kerb_weight: string;
  wheelbase: string;
  payload: string;
  width: string;
  height: string;
  length: string;
  rear_overhang: string;
  front_overhang: string;
  cargo_box_dimensions: string;
  chassis_type: string;
  cabin_type: string;
  cabin_type_day: string;
  body_option: string;
  body_type: string;
  load_body_length: string;
  load_body_type: string;
  seating_capacity_layout: string;
  passenger_door: string;
  side_windows: string;
  hat_rack: string;
  axle_configuration: string;
  front_axle: string;
  rear_axle: string;
  turning_radius: string;
  tubeless_tyres: string;
  tyre_type: string;
  no_wheels: string;
  front_tyre: string;
  rear_tyre: string;
  wheel_rim: string;
  ground_clearance: string;
  air_conditioning: string;
  cruise_control: string;
  navigation_system: string;
  telematics: string;
  tiltable_steering: string;
  arm_rest: string;
  seat_type: string;
  steering_type: string;
  power_steering: string;
  driver_information_display: string;
  adjustable_driver_seat: string;
  rear_suspension: string;
  front_suspension: string;
  abs: string;
  brake_type: string;
  front_breaks: string;
  rear_breaks: string;
  hill_hold: string;
  parking_breaks: string;
  fuel_indicator: string;
  fog_lights: string;
  air_bags: string;
  seat_belts: string;
  warranty: string;
  engine_oil_change_interval: string;
  video_url: string;
  hotspot: string;


  product_type: string;
  product_category: string;
  load_body_dimensions: string;

  gvw_s: string;
  max_power_s: string;
  fuel_tank_capacity_s: string;
  engine_type_s: string;
  test_drive: any;


  video_url_s: []
}

export class prodInput {
  product_image_id: number
}

export class InventoryImage {
  file_path: string;
  product_image_id: number;
}