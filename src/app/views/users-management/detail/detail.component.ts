import {Component, OnDestroy, ViewChild, ElementRef, OnInit} from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { User } from '../../../_models';
import { FormGroup } from '@angular/forms';
import { DialogComponent } from '../../../components';
import { ActivatedRoute } from '@angular/router';
import { UserManagementService, UserPaymentAddressService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  templateUrl: 'detail.component.html',
  styleUrls:['detail.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false } },
  ]
})
export class DetailComponent implements OnInit  {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild("labelImport") labelImport: ElementRef;

  public user_id: number;
  public formImport: FormGroup;
  public fileToUpload: File = null;

  constructor(
    private route: ActivatedRoute,
    private userManagementService: UserManagementService,
    private userPaymentAddressService: UserPaymentAddressService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
    });
  }

  ngOnInit(): void {
    this.user = new User();
    this.userPaymentAddresses = [];
    this.getUser();
    this.getCountryList();
    this.getUserPaymentAddressList();
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

  user: User;
  getUser() {
    this.spinner.show();
    this.userManagementService.getUser(this.user_id).subscribe(
      (result) => {
        this.spinner.hide();
        this.user = result.data;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  userPaymentAddresses: [];
  getUserPaymentAddressList() {
    this.spinner.show();
    this.userPaymentAddressService.getUserPaymentAddressListByAdmin(this.user_id).subscribe(
      (result) => {
        this.spinner.hide();
        this.userPaymentAddresses = result.data;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  countries: [];
  getCountryList() {
    this.spinner.show();
    this.userManagementService.getCountryList().subscribe(
      (result) => {
        this.spinner.hide();
        this.countries = result.data;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }
}
