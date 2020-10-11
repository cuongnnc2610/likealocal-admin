import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../../_models';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { UserManagementService, UserPaymentAddressService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { Country } from '../../../_models/country';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../../components';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css']
})
export class EditComponent implements OnInit {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('addUserPaymentAddress') addUserPaymentAddress: ModalDirective;
  @ViewChild('editUserPaymentAddress') editUserPaymentAddress: ModalDirective;
  @ViewChild('modalConfirmRemoveAddress') modalConfirmRemoveAddress: ModalDirective;
  @ViewChild('modalUpdateSuccessfull') modalUpdateSuccessfull: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  
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

  //TRANSLATE
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
        this.editUserForm.setValue({
          email: this.user.email,
          company: this.user.company,
          name: this.user.name,
          country_id: this.user.country_id,
          phone_number: this.user.phone_number,
          postal_code: this.user.postal_code,
          address: this.user.address,
        });
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

  userForm = new FormGroup({
    email: new FormControl("", [Validators.required,Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),Validators.maxLength(64)]),
    company: new FormControl("", [Validators.required,Validators.maxLength(64)]),
    name: new FormControl("", [Validators.required,Validators.maxLength(32)]),
    country_id: new FormControl("", [Validators.required,]),
    phone_number: new FormControl("", [Validators.pattern("^(0)[0-9-]+$"),Validators.minLength(9),Validators.maxLength(15)]),
    postal_code: new FormControl("", [Validators.pattern("^[0-9-]+$"),Validators.minLength(3),Validators.maxLength(10)]),
    address: new FormControl("", [Validators.maxLength(255)]),
  });
  editUserForm = this.userForm;
  clearEditUserForm() {
    this.editUserForm.reset();
    this.editUserForm.setValue({
      email: '',
      company: '',
      name: '',
      country_id: this.countries[0].id,
      phone_number: '',
      postal_code: '',
      address: '',
    });
    this.getCountryList();
  }

  countries: Country[];
  getCountryList() {
    this.spinner.show();
    this.userManagementService.getCountryList().subscribe(
      (result) => {
        this.spinner.hide();
        this.countries = result.data;
        this.country_id = this.countries[0].id;
        this.country = this.countries[0].country;
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  isEmailExisted = false;
  
  hideErrorIsEmailExisted() {
    this.isEmailExisted = false;
  }

  updateUser(){
    this.isEmailExisted = false;
    if (this.editUserForm.invalid) {
      return;
    }
    this.spinner.show();
    this.userManagementService.updateUser(this.user_id, this.editUserForm.value, this.country_id)
    .subscribe(
    (result) => {
      this.spinner.hide();
      if (result.code === "C015") {
          this.isEmailExisted = true;
          return;
        }
        if (result.status === 200 && result.code === "C000") {
          this.dialog.show("The user has been edited", "success");
          // this.modalUpdateSuccessfull.show();
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


  userPaymentAddressForm = new FormGroup({
    name: new FormControl("", [Validators.required,Validators.maxLength(64)]),
    country_id: new FormControl("", [Validators.required,]),
    phone_number: new FormControl("", [Validators.required,Validators.pattern("^(0)[0-9-]+$"),Validators.minLength(9),Validators.maxLength(15)]),
    postal_code: new FormControl("", [Validators.required,Validators.pattern("^[0-9-]+$"),Validators.minLength(3),Validators.maxLength(10)]),
    address: new FormControl("", [Validators.required,Validators.maxLength(255)]),
  });
  addUserPaymentAddressForm = this.userPaymentAddressForm;
  clearAddUserPaymentAddressForm() {
    this.addUserPaymentAddressForm.reset();
    this.country = this.countries[0].country;
    this.addUserPaymentAddressForm.setValue({
      name: '',
      country_id: this.countries[0].id,      
      phone_number: '',
      postal_code: '',
      address: '',
    });
  }

  country: string;
  isAddAddressSubmitted: boolean = false;
  createUserPaymentAddress() {
    if (this.addUserPaymentAddressForm.invalid) {
      this.isAddAddressSubmitted = true;
      return;
    }
    this.spinner.show();
    this.userPaymentAddressService.createUserPaymentAddress(this.user_id, this.addUserPaymentAddressForm.value, this.country_id)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.status === 200 && result.code === "C000") {
          this.dialog.show("The delivery has been added", "success");
          this.addUserPaymentAddress.hide();
          this.clearAddUserPaymentAddressForm();
          this.getUserPaymentAddressList();
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

  isEditAddressSubmitted: boolean = false;
  updateUserPaymentAddress() {
    if (this.editUserPaymentAddressForm.invalid) {
      this.isEditAddressSubmitted = true;
      return;
    }
    this.spinner.show();
    this.userPaymentAddressService.updateUserPaymentAddress(this.user_payment_address.id, this.editUserPaymentAddressForm.value, this.country_id)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.status === 200 && result.code === "C000") {
          this.dialog.show("The delivery has been edited", "success");
          this.editUserPaymentAddress.hide();
          this.clearEditUserPaymentAddressForm();
          this.getUserPaymentAddressList();
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

  deleteUserPaymentAddress() {
    this.spinner.show();
    this.userPaymentAddressService.deleteUserPaymentAddress(this.user_payment_address.id)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.status === 200 && result.code === "C000") {
          this.dialog.show("The delivery has been deleted", "success");
          this.modalConfirmRemoveAddress.hide();
          this.getUserPaymentAddressList();
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

  user_payment_address: any;
  getUserPaymentAddress(user_payment_address: any) {
    this.editUserPaymentAddressForm.setValue({
      name: user_payment_address.name,
      country_id: user_payment_address.country_id,      
      phone_number: user_payment_address.phone_number,
      postal_code: user_payment_address.postal_code,
      address: user_payment_address.address,
    });
    this.user_payment_address = user_payment_address;
    this.country_id = user_payment_address.country_id;
  }

  editUserPaymentAddressForm = this.userPaymentAddressForm;
  clearEditUserPaymentAddressForm() {
    this.editUserPaymentAddressForm.reset();
    this.editUserPaymentAddressForm.setValue({
      name: '',
      country_id: this.countries[0].id,      
      phone_number: '',
      postal_code: '',
      address: '',
    });
  }

  get f() {
    return this.userForm.controls;
  }

  get email() {
    return this.userForm.get("email");
  }

  get company() {
    return this.userForm.get("company");
  }

  get name() {
    return this.userForm.get("name");
  }

  get phone_number() {
    return this.userForm.get("phone_number");
  }

  get postal_code() {
    return this.userForm.get("postal_code");
  }

  get address() {
    return this.userForm.get("address");
  }

  country_id: number;
  getCountry(id: number) {
    this.country_id = id;
  }
}
