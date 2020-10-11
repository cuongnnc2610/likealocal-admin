import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OrderManagementService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from '../../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-management',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild("labelImport")
  labelImport: ElementRef;
  formImport: FormGroup;
  fileToUpload: File = null;

  public message: string;
  public searchBox: string = null;
  public orders: [];  
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  

  constructor(
    private orderManagementService: OrderManagementService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getOrderList();
    this.translateLang();
  }

  //TRANSLATE
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
    this.getOrderList(data);
  }

  // SEARCH FORM
  searchForm = new FormGroup({
    order_number: new FormControl("", []),
    date: new FormControl("", []),
    email: new FormControl("", []),
    phone_number: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      order_number: '',
      date: '',
      email: '',
      phone_number: ''
    });
  }

  isSearching: boolean = false;
  getOrderList(numberPage: number = 1) {
    // this.spinner.show();
    this.orders = [];
    let orderDate = '';
    if (this.searchInputForm.controls.date.value) {
      const pickedDate = new Date(this.searchInputForm.controls.date.value);
      orderDate = pickedDate.getFullYear() + '-';
      orderDate += ((pickedDate.getMonth() + 1) > 9 ? (pickedDate.getMonth() + 1) : '0' + (pickedDate.getMonth() + 1)) + '-';
      orderDate += pickedDate.getDate() > 9 ? pickedDate.getDate() : '0' + pickedDate.getDate();
    }
    
    this.orderManagementService.getOrderList(numberPage, this.searchInputForm.controls.order_number.value, this.searchInputForm.controls.email.value, this.searchInputForm.controls.phone_number.value, orderDate).subscribe(
      (result) => {
        if (!this.searchInputForm.controls.order_number.value && !this.searchInputForm.controls.email.value && !this.searchInputForm.controls.phone_number.value && !this.searchInputForm.controls.date.value) {
          this.isSearching = false;
        } else {
          this.isSearching = true;
        }
        this.orders = result.data;
        this.total = result.total;
        this.pageSize = result.per_page;
        this.from = result.from;
        this.lastPage = result.last_page;
        // this.spinner.hide();
      },
      (error) => {
        // this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }
}
