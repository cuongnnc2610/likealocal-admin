import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../../components';
import { ActivatedRoute } from '@angular/router';
import { UserManagementService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { Country } from '../../../_models/country';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  templateUrl: 'add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddComponent {
  @ViewChild("labelImport") labelImport: ElementRef;
  @ViewChild('addUserPaymentAddress') addUserPaymentAddress: ModalDirective;
  @ViewChild('editUserPaymentAddress') editUserPaymentAddress: ModalDirective;
  @ViewChild('modalConfirmRemoveAddress') modalConfirmRemoveAddress: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;

  public user_id: number;
  public formImport: FormGroup;
  public fileToUpload: File = null;

  constructor(
    private route: ActivatedRoute,
    private userManagementService: UserManagementService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
    });
  }

  ngOnInit(): void {
    this.getCountryList();
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

  userForm = new FormGroup({
    email: new FormControl("",
      [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"), Validators.maxLength(64)]),
    company: new FormControl("", [Validators.required, Validators.maxLength(64),]),
    name: new FormControl("", [Validators.required, Validators.maxLength(32),]),
    // country_id: new FormControl("", [
    //   Validators.required,
    // ]),
    phone_number: new FormControl("", [Validators.pattern("^(0)[0-9-]+$"), Validators.minLength(9), Validators.maxLength(15)]),
    postal_code: new FormControl("", [Validators.pattern("^[0-9-]+$"), Validators.minLength(3), Validators.maxLength(10)]),
    address: new FormControl("", [Validators.maxLength(255),]),
  });

  addUserForm = this.userForm;
  clearAddUserForm() {
    this.addUserForm.reset();
    this.addUserForm.setValue({
      email: '',
      company: '',
      name: '',
      // country_id: this.countries[0].id,
      phone_number: '',
      postal_code: '',
      address: '',
    });
    this.isAddUserSubmitted = false;
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

  isAddUserSubmitted: boolean = false;
  createUser() {
    this.isEmailExisted = false;
    if (this.addUserForm.invalid) {
      this.isAddUserSubmitted = true;
      return;
    }
    if (this.userPaymentAddresses.length === 0) {
      this.dialog.show('Please enter the delivery address', 'error');
      return;
    }
    this.spinner.show();
    this.userManagementService.createUser(this.addUserForm.value, this.userPaymentAddresses, this.country_id)
      .subscribe(
        (result) => {
          this.spinner.hide();
          if (result.code === "C015") {
            this.isEmailExisted = true;
            return;
          }
          if (result.status === 200 && result.code === "C000") {
            this.dialog.show("The user has been added", "success");
            this.clearAddUserForm();
            this.userPaymentAddresses = new Array();
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
    name: new FormControl("", [Validators.required, Validators.maxLength(64)]),
    country_id: new FormControl("", [Validators.required,]),
    phone_number: new FormControl("", [Validators.required, Validators.pattern("^(0)[0-9-]+$"), Validators.minLength(9), Validators.maxLength(15)]),
    postal_code: new FormControl("", [Validators.required, Validators.pattern("^[0-9-]+$"), Validators.minLength(3), Validators.maxLength(10)]),
    address: new FormControl("", [Validators.required, Validators.maxLength(255)]),
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

  userPaymentAddresses: any[] = new Array();
  userPaymentAddressId: number = 1;
  country: string;

  isAddAddressSubmitted: boolean = false;
  createUserPaymentAddress() {
    if (this.addUserPaymentAddressForm.invalid) {
      this.isAddAddressSubmitted = true;
      return;
    }
    for (let index = 1; index < this.countries.length; index++) {
      if (this.countries[index].id == this.addUserPaymentAddressForm.controls.country_id.value) {
        this.country = this.countries[index].country;
      }
    }
    this.userPaymentAddresses.push({
      id: this.userPaymentAddressId++,
      name: this.addUserPaymentAddressForm.controls.name.value,
      country_id: this.addUserPaymentAddressForm.controls.country_id.value,
      country: this.country,
      phone_number: this.addUserPaymentAddressForm.controls.phone_number.value,
      postal_code: this.addUserPaymentAddressForm.controls.postal_code.value,
      address: this.addUserPaymentAddressForm.controls.address.value,
    });
    this.addUserPaymentAddress.hide();
    this.dialog.show('The delivery has been added', 'success');
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

  isEditAddressSubmitted: boolean = false;
  updateUserPaymentAddress() {
    if (this.editUserPaymentAddressForm.invalid) {
      this.isEditAddressSubmitted = true;
      return;
    }
    for (let index = 1; index < this.countries.length; index++) {
      if (this.countries[index].id == this.addUserPaymentAddressForm.controls.country_id.value) {
        this.country = this.countries[index].country;
      }
    }
    const foundIndex = this.userPaymentAddresses.findIndex(x => x.id == this.user_payment_address.id);
    this.userPaymentAddresses[foundIndex] = {
      name: this.editUserPaymentAddressForm.controls.name.value,
      country_id: this.editUserPaymentAddressForm.controls.country_id.value,
      country: this.country,
      phone_number: this.editUserPaymentAddressForm.controls.phone_number.value,
      postal_code: this.editUserPaymentAddressForm.controls.postal_code.value,
      address: this.editUserPaymentAddressForm.controls.address.value,
    };
    this.editUserPaymentAddress.hide();
    this.dialog.show('The delivery has been edited', 'success');
  }

  deleteUserPaymentAddress() {
    const id = this.user_payment_address.id;
    this.userPaymentAddresses = this.userPaymentAddresses.filter(function (obj) {
      return obj.id !== id;
    });
    this.modalConfirmRemoveAddress.hide();
    this.dialog.show('The delivery has been deleted', 'success');
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
