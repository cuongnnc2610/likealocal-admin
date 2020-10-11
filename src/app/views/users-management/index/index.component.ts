import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { UserManagementService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-management',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('addUser') addUser: ModalDirective;
  @ViewChild('editUser') editUser: ModalDirective;
  @ViewChild('modalConfirmRemoveUser') modalConfirmRemoveUser: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;

  public message: string;
  public searchBox: string = null;
  public users: User[];
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public formImport: FormGroup;
  public fileToUpload: File = null;

  constructor(
    private userManagementService: UserManagementService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.users = [];
    this.getUserList();
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
    this.getUserList(data);
  }

  // SEARCH FORM
  searchForm = new FormGroup({
    email: new FormControl("", []),
    name: new FormControl("", []),
    phone_number: new FormControl("", []),
  });
  searchInputForm = this.searchForm;
  clearSearchInputForm() {
    this.searchInputForm.setValue({
      name: '',
      email: '',
      phone_number: ''
    });
  }

  isSearching: boolean = false;
  getUserList(numberPage: number = 1) {
    this.spinner.show();
    this.userManagementService.getUserList(numberPage, this.searchInputForm.controls.name.value, this.searchInputForm.controls.email.value, this.searchInputForm.controls.phone_number.value).subscribe(
      (result) => {
        this.spinner.hide();
        if (!this.searchInputForm.controls.name.value && !this.searchInputForm.controls.email.value && !this.searchInputForm.controls.phone_number.value) {
          this.isSearching = false;
        } else {
          this.isSearching = true;
        }
        this.users = result.data;
        this.total = result.total;
        this.pageSize = result.per_page;
        this.from = result.from;
        this.lastPage = result.last_page;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  user: any;
  getUser(user: any) {
    this.user = user;
  }

  deleteUser() {
    this.userManagementService.deleteUser(this.user.id).subscribe(
      (result) => {
        if (result.status === 200 && result.code === "C000") {
          this.modalConfirmRemoveUser.hide();
          this.dialog.show("The user has been deleted", "success");
          this.getUserList(this.page);
        } else {
          this.dialog.show(result.message, 'error');
        }
      },
      (error) => {
        this.dialog.show(error, 'error');
      }
    );
  }
}
