import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { NotificationService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-notification',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public message: string;
  public searchBox: string = null;
  public total: any; // total number of users
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1
  public from: number = 0;
  public lastPage: any; // Total page  
  public notifications: Notification[];  

  @ViewChild("labelImport")
  labelImport: ElementRef;
  formImport: FormGroup;
  fileToUpload: File = null;
  @ViewChild('modalAddNotification') modalAddNotification: ModalDirective;
  @ViewChild('modalEditNotification') modalEditNotification: ModalDirective;
  @ViewChild('modalConfirmRemoveNotification') modalConfirmRemoveNotification: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;

  constructor(
    private notificationService: NotificationService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.notifications = [];
    this.notification = {};
    this.getNotificationList();
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
    this.getNotificationList(data);
  }

  getNotificationList(numberPage: number = 1) {
    // this.spinner.show();
    this.notificationService.getListNotification(numberPage).subscribe(
      (result) => {
        // this.spinner.hide();
        this.notifications = result.data;
        this.total = result.total;
        this.pageSize = result.per_page;
        this.from = result.from;
        this.lastPage = result.last_page;
      },
      (error) => {
        // this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }

  deleteNotification() {
    this.notificationService.destroy(this.notification.id).subscribe(
      (result) => {
        if (result.status === 200 && result.code === "C000") {
          this.modalConfirmRemoveNotification.hide();
          this.dialog.show("The notice has been deleted", "success");
          this.getNotificationList(this.page);
        } else {
          this.dialog.show(result.message, 'error');
        } 
      },
      (error) => {
        this.dialog.show(error, 'error');
      }
    );
  }

  isAddNotificationSubmitted: boolean = false;
  isEditNotificationSubmitted: boolean = false;
  notificationForm = new FormGroup({
    title: new FormControl("", [
      Validators.required,
      Validators.maxLength(255),
    ]),
    message: new FormControl("", [
      Validators.required,
      Validators.maxLength(2000),
    ]),
  });
  addNotificationForm = this.notificationForm;
  editNotificationForm = this.notificationForm;
  clearAddNotificationForm() {
    this.addNotificationForm.reset();
    this.addNotificationForm.setValue({
      title: '',
      message: '',
    });
    this.isAddNotificationSubmitted = false;
  }
  clearEditNotificationForm() {
    this.editNotificationForm.reset();
    this.editNotificationForm.setValue({
      title: '',
      message: '',
    });
    this.isEditNotificationSubmitted = false;
  }

  notification: any;
  getNotification(notification: any) {
    this.notification = notification;
    this.editNotificationForm.setValue({
      title: notification.title, 
      message: notification.message
    });
  }

  createNotification(){
    if (this.addNotificationForm.invalid) {
      this.isAddNotificationSubmitted = true;
      return;
    }
    // this.spinner.show();
    this.notificationService.store(this.addNotificationForm.value)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.status === 200 && result.code === "C000") {
          this.modalAddNotification.hide();
          this.dialog.show("The notice has been added", "success");
          this.getNotificationList(this.page);
          this.clearAddNotificationForm();
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

  editNotification(){
    if (this.editNotificationForm.invalid) {
      this.isEditNotificationSubmitted = true;
      return;
    }
    // this.spinner.show();
    const notification = this.addNotificationForm.value;
    notification.id = this.notification.id;

    this.notificationService.update(notification)
    .subscribe(
      (result) => {
        this.spinner.hide();
        if (result.status === 200 && result.code === "C000") {
          this.modalEditNotification.hide();
          this.dialog.show("The notice has been edited", "success");
          this.getNotificationList(this.page);
          this.clearEditNotificationForm();
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

}
