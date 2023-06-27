import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-submenu-list',
  templateUrl: './submenu-list.component.html',
  styleUrls: ['./submenu-list.component.scss']
})
export class SubmenuListComponent implements OnInit {

  @Input() ActiveMenu: any;
  Role: any;
  constructor(private router: Router, private route: ActivatedRoute) { }
  href: any
  pagedetails: any
  MenuDetails: any;
  Pagemasterid:any;
  page:any;
  totalElements:any
  FilterString:any
  ngOnInit(): void {
    this.href = this.router.url;
    var list = JSON.parse(localStorage.getItem('PageDetails') || '{}')
    this.pagedetails = list;

    this.Pagemasterid = this.route.snapshot.queryParamMap.get('page');

    var data2 = this.pagedetails.filter((book:any) => book.page_master_id === Number(this.Pagemasterid));
    this.MenuDetails = data2[0].page_detail;
}

  tab: any = 0
  onClick(check:any, row:any) {
    this.tab = check

    var Page = "pages/" + row.page_url
    localStorage.setItem('subMenu',row.page_detail_id)
    this.router.navigate([Page], { queryParams: { page: this.Pagemasterid } });
  }

}
export class ListInput {
  owner: any;
}
