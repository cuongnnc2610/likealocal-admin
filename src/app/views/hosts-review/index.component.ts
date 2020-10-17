import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HostsReview } from '../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { HostsReviewService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-hosts-review',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('modalDetailHostsReview') modalDetailHostsReview: ModalDirective;
  @ViewChild('modalEditHostsReview') modalEditHostsReview: ModalDirective;
  @ViewChild('modalConfirmRemoveHostsReview') modalConfirmRemoveHostsReview: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
  public message: string;
  public searchBox: string = null;
  public hostsReviews: HostsReview[];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;
  
  constructor(
    private HostsReviewService: HostsReviewService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.hostsReviews = [];
    this.hostsReview = new HostsReview();
    this.getHostsReviews();
    this.translateLang();
  }

  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }

  //PAGINATION
  currentPage(data: any) {
    this.spinner.show();
    this.getHostsReviews(data);
  }

  orderType: number = 1;
  changeOrderType(orderType: any) {
    if (this.orderType === orderType) {
      orderType++;
    }
    this.orderType = orderType;
    this.currentPage(1);
  }

  getHostsReviews(numberPage: number = 1) {    
    this.HostsReviewService.getHostsReviews(numberPage, this.searchInputForm.controls, this.orderType).subscribe(
      (result) => {
        console.log(result);
        result = result.data;
        this.spinner.hide();
        this.hostsReviews = result.data;
        this.total = result.total;
        this.pageSize = result.per_page;
        this.from = result.from;
        this.lastPage = result.last_page;
        this.page = numberPage;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  hostsReview: HostsReview;
  getHostsReview(hostsReview: any) {
    this.hostsReview = hostsReview;
  }

  deleteHostsReview() {
    this.spinner.show();
    this.HostsReviewService.deleteHostsReview(this.hostsReview).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.code === 20001) {
          this.modalConfirmRemoveHostsReview.hide();
          this.dialog.show("The hosts review has been deleted", "success");
          this.getHostsReviews(this.page);
        } else {
          this.dialog.show(result.message, 'error');
        } 
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  // SEARCH FORM
  searchForm = new FormGroup({
    content: new FormControl("", []),
    host: new FormControl("", []),
    user: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      content: '',
      host: '',
      user: '',
    });
  }
}
