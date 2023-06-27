import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataPassService } from '../../shared/Services/data-pass.service';
import { BlogService } from '../../shared/Services/blog.service';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/shared/Services/file-upload/file-upload.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit, OnDestroy {
  sub: Subscription = new Subscription();
  pagevalid: any;
  ActiveMenu: any;
  showLoader: boolean = false;
  totalrecord: number = 0;
  currentPage: number = 1;
  noofrecordsperpage: number = 10;
  showRecords: number = 10;
  blogList: any = []
  rowData: any = [];

  filterInputData: any;
  filterFields: any;
  Filterarray: any;
  closeResult: any;

  @ViewChild('blogAddEdit', { read: TemplateRef, static: false }) blogAddEdit: TemplateRef<any>;
  flag: any;
  constructor(private datapass: DataPassService, private BlogService: BlogService, private router: Router,
    private modalService: NgbModal, private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.pagevalid = this.datapass.GetPageVlidation('BlogList')
    if (this.pagevalid) {
      this.filterFields = {
        "blogTitle": true,
        "blogTags": true,
        "blogStatus": true,
        "blogType": true,
        "blogTypeofBlog": true,
        "blogPriority": true,
      }
      this.ActiveMenu = localStorage.getItem("subMenu");
      this.currentPage = 1
      this.noofrecordsperpage = 10;
      this.showRecords = 10;
      const ListInput: Input = {} as Input;
      ListInput.offset = 0;
      ListInput.limit = this.noofrecordsperpage;
      this.getBlogList(ListInput);
    } else {
      this.router.navigate(['session/NOTFound']);
    }
  }

  getBlogList(ListInput) {
    this.showLoader = true
    this.FilterStrings(ListInput);
    this.blogList = []
    this.totalrecord = 0;
    this.sub.add(this.BlogService.tataMitraList(ListInput.offset, ListInput.limit, ListInput.tag,
      ListInput.title, ListInput.type, ListInput.status, ListInput.priority, ListInput.type_of_blog).subscribe(
        result => {
          this.blogList = []
          if (result.success) {
            this.blogList = result.data;
            this.blogList = [...this.blogList]
            this.totalrecord = result.total_result;
            this.showRecords = (((this.currentPage * 10) - 10) + result.data.length);
            this.showLoader = false
          }
          else {
            this.blogList = [];
            this.totalrecord = 0;
            this.showRecords = 0;
            this.showLoader = false
          }
        }, (err) => {
          Swal.fire(err.error.data.msg)
          this.blogList = [];
          this.totalrecord = 0;
          this.showRecords = 0;
          this.showLoader = false
        }
      ));
  }

  filterData(req) {
    this.filterInputData = req;
    this.pageChange(1)
  }


  pageChange(page: any) {

    this.currentPage = page;
    page = page - 1;
    // this.isCustomizerOpen = false;
    const ListInput: Input = {} as Input;
    ListInput.offset = (page * 10);
    ListInput.limit = this.noofrecordsperpage
    ListInput.tag = this.filterInputData.blogTags ? this.filterInputData.blogTags : '';
    ListInput.title = this.filterInputData.blogTitle ? this.filterInputData.blogTitle : '';
    ListInput.type = this.filterInputData.blogType ? this.filterInputData.blogType : '';
    ListInput.status = this.filterInputData.blogStatus ? this.filterInputData.blogStatus : '';
    ListInput.priority = this.filterInputData.priority ? this.filterInputData.priority : '';
    ListInput.type_of_blog = this.filterInputData.type_of_blog ? this.filterInputData.type_of_blog : '';
    this.getBlogList(ListInput);
  }

  FilterStrings(ListInput) {
    this.Filterarray = [];
    for (let item in ListInput) {
      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'limit');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    // this.Filterarray = this.Filterarray.filter(book => book.Key !== 'blog_status');

    // if (ListInput.status) {
    //   if (ListInput.blog_status == true) {
    //     var Json1 = { "Key": 'is_active', "Value": 'Active' }
    //   }
    //   else {
    //     var Json1 = { "Key": 'is_active', "Value": 'Inactive' }
    //   }
    //   this.Filterarray.push(Json1)
    // }
  }

  openPopup(row, flag) {
    this.flag = flag
    this.rowData = row
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: 'sm',
      modalDialogClass: 'dark-modal'
    };
    this.modalService.open(this.blogAddEdit, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      const ListInput: Input = {} as Input;
      ListInput.offset = 0;
      ListInput.limit = 10;
      this.getBlogList(ListInput);
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

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

  Approve(row) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure want to Publish?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.ApproveReject(row, 'APPROVED')
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  DeApprove(row) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure want to Un-publish?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.ApproveReject(row, 'DISAPPROVED')
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  ApproveReject(data, actionType) {
    try {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append('action_type', 'edit');
      formData.append('type_of_blog', data.type_of_blog);
      formData.append("title", data.title);
      formData.append("tag", data.tag);
      formData.append('author_name', data.author_name);
      formData.append('description', data.description);
      formData.append('author_description', data.author_description);
      formData.append('blog_status', actionType);
      this.sub.add(this.fileUploadService.uploadBlog(formData).subscribe(
        data => {
          if (data.success == true) {
            const ListInput: Input = {} as Input;
            ListInput.offset = this.currentPage - 1
            Swal.fire({
              title: data.data.msg,
              // text: "You won't be able to revert this!",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                this.getBlogList(ListInput);
              }
              else {
                this.getBlogList(ListInput);
              }
            })
          }
          else {
            // this.items = this.temp = [];
            //this.loader.close();
          }
        }, (err) => {
        }
      ));
    } catch (error) {
      this.showLoader = false
    }
  }

}

export class Input {
  offset: number;
  limit: number;
  title: string;
  type: string;
  status: string;
  tag: Array<any>;
  author_name: string;
  id: string;
  priority: string;
  type_of_blog: string;

}
