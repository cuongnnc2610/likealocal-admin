import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormControl, FormGroup, Validators, NG_VALIDATORS } from "@angular/forms";
import { PartManagementService } from "../../_services";
import { GroupPart } from "../../_models/groupPart";
import { TranslateService } from "@ngx-translate/core";
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileTypeValidator } from '../../_directive';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-group-part-management",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"],
})
export class IndexComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild('addGroupPartModal') addGroupPartModal: ModalDirective;
  @ViewChild('editGroupPartsModal') editGroupPartsModal: ModalDirective;
  @ViewChild("labelAddGroupPart") labelAddGroupPart: ElementRef;
  @ViewChild("labelEditGroupPart") labelEditGroupPart: ElementRef;
  @ViewChild("addGroupPartFile") addGroupPartFile: ElementRef;
  @ViewChild("editGroupPartFile") editGroupPartFile: ElementRef;

  public noData = false;
  public resultNoData = false;

  public isAddSubmitted = false;
  public isEditSubmitted = false;

  public imagePathAdd;
  public imagePathEdit;
  public addGroupPartImgURL: any = '';
  public editGroupPartImgURL: any = '';
  private addFileToUpload: File = null;
  private editFileToUpload: File = null;
  public labelOverflow: string;
  public currentImage = '';
  public showDeleteBtnAddImage = false;
  public showDeleteBtnEditImage = false;

  public groupParts: GroupPart[] = [];
  public groupPart: GroupPart;
  public total = 0; // total number of GroupParts
  public pageSize = 0; // The number of items per page.
  public page = 1; //The current page. Default is 1
  public noPart = 0;
  public idPart: Number;

  public addGroupPartForm: FormGroup;
  public editGroupPartForm: FormGroup;

  public msgAddPartSuccess = 'The part has been added';
  public msgAddPartFail = 'The part has been added failure';
  public msgEditPartSuccess = 'The part has been edited';
  public msgEditPartFail = 'The part has been edited failure"';
  public msgDeleteSuccess = 'The part has been deleted';
  public msgDeleteFail = 'The part has been deleted failure"';
  public duplicateID: boolean;

  constructor(
    private partManagementService: PartManagementService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.translateLang();
    this.onInitFormAddGroupPart();
    this.onInitFormEditGroupPart();
    this.getListGroupParts();
  }

  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }

  currentPage(data: any) {
    this.getListGroupParts(data);
  }

  /** FORM */
  onInitFormAddGroupPart() {
    this.addGroupPartForm = new FormGroup({
      groupPartCode: new FormControl('', [Validators.required, Validators.pattern("[0-9]*"), Validators.maxLength(15),]),
      groupPartName: new FormControl('', [Validators.required, Validators.maxLength(64)]),
      addGroupPartImage: new FormControl('', [FileTypeValidator.validate]),
    });
    this.imagePathAdd, this.addGroupPartImgURL = '';
    this.duplicateID = false;
    this.isAddSubmitted = false;
    this.showDeleteBtnAddImage = false;
    this.labelOverflow = '';
  }

  onInitFormEditGroupPart() {
    this.editGroupPartForm = new FormGroup({
      groupPartCode: new FormControl('', [Validators.required, Validators.pattern("[0-9]*"), Validators.maxLength(15)]),
      groupPartName: new FormControl('', [Validators.required, Validators.maxLength(64)]),
      editGroupPartImage: new FormControl('', [FileTypeValidator.validate]),
      groupPartImage: new FormControl('', [])
    });
    this.imagePathAdd, this.editGroupPartImgURL = '';
    this.duplicateID = false;
    this.isEditSubmitted = false;
    this.showDeleteBtnEditImage = false;
    this.labelOverflow = '';
  }

  get addGroupPartCode() {
    return this.addGroupPartForm.get('groupPartCode');
  }

  get addGroupPartName() {
    return this.addGroupPartForm.get('groupPartName');
  }

  get addGroupPartImage() {
    return this.addGroupPartForm.get('addGroupPartImage');
  }

  get editGroupPartCode() {
    return this.editGroupPartForm.get('groupPartCode');
  }

  get editGroupPartName() {
    return this.editGroupPartForm.get('groupPartName');
  }

  get editGroupPartImage() {
    return this.editGroupPartForm.get('editGroupPartImage');
  }

  onChangeValue(change: string) {
    if (change == 'partID') {
      this.duplicateID = false;
    }
  }

  onFileAddChange(files: FileList) {
    if (files.length === 0) return;
    this.labelAddGroupPart.nativeElement.innerText = Array.from(files).map((f) => f.name).join(", ");
    this.addFileToUpload = files.item(0);
    if (this.addGroupPartForm.controls?.addGroupPartImage?.errors === null) {
      this.showDeleteBtnAddImage = true;
    } else {
      this.showDeleteBtnAddImage = false;
    }
    this.labelImageOverflow();
    if (this.labelAddGroupPart.nativeElement.innerText === '') {
      this.showDeleteBtnAddImage = false;
      this.addGroupPartImgURL = '';
      this.labelAddGroupPart.nativeElement.innerText = 'Choose file';
    }
  }

  previewAdd(files) {
    if (files.length === 0) return;
    var reader = new FileReader();
    this.imagePathAdd = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.addGroupPartImgURL = reader.result;
    };
  }

  onFileEditChange(files: FileList) {
    if (files.length === 0) return;
    this.labelEditGroupPart.nativeElement.innerText = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    this.editFileToUpload = files.item(0);
    if (this.editGroupPartForm.controls?.editGroupPartImage?.errors === null) {
      this.showDeleteBtnEditImage = true;
    } else {
      this.showDeleteBtnEditImage = false;
    }
    this.labelImageOverflow();
    if (this.labelEditGroupPart.nativeElement.innerText === '') {
      this.editGroupPartImgURL = '';
      this.showDeleteBtnEditImage = false;
      this.labelEditGroupPart.nativeElement.innerText = 'Choose file';
    }
  }

  previewEdit(files) {
    if (files.length === 0) return;
    var reader = new FileReader();
    this.imagePathEdit = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.editGroupPartImgURL = reader.result;
    };
  }

  editGroupParts(groupPart: any) {
    // this.spinner.show();
    this.editGroupPartForm.setValue({
      groupPartCode: groupPart?.code_number,
      groupPartName: groupPart?.name,
      editGroupPartImage: '',
      groupPartImage: groupPart?.image
    });

    if (!groupPart?.image) {
      this.showDeleteBtnEditImage = false;
    } else {
      this.showDeleteBtnEditImage = true;
    }
    this.editGroupPartImgURL = groupPart?.image;
    this.currentImage = groupPart?.image;
    this.groupPart = groupPart;
    // this.spinner.hide();
  }

  labelImageOverflow() {
    this.labelOverflow = '';
    if (this.labelAddGroupPart.nativeElement.innerText?.length > 30) {
      this.labelOverflow = this.labelAddGroupPart.nativeElement.innerText.split('.');
      this.labelAddGroupPart.nativeElement.innerText = this.labelOverflow[0].slice(0, 20)
        + '...' + this.labelOverflow[0].slice(this.labelOverflow[0].length - 10, this.labelOverflow[0].length)
        + '.' + this.labelOverflow[1];
      return;
    }
    if (this.labelEditGroupPart.nativeElement.innerText?.length > 30) {
      this.labelOverflow = this.labelEditGroupPart.nativeElement.innerText.split('.');
      this.labelEditGroupPart.nativeElement.innerText = this.labelOverflow[0].slice(0, 20)
        + '...' + this.labelOverflow[0].slice(this.labelOverflow[0].length - 10, this.labelOverflow[0].length)
        + '.' + this.labelOverflow[1];
      return;
    }
  }

  idDeletePart(id: number) {
    this.idPart = id;
  }

  btnDeleteImage() {
    this.editGroupPartForm.patchValue({
      groupPartImage: ''
    });
    this.addGroupPartImgURL = '';
    this.editGroupPartImgURL = '';
    this.labelOverflow = '';
    this.addGroupPartFile.nativeElement.value = "";
    this.editGroupPartFile.nativeElement.value = "";
    this.labelAddGroupPart.nativeElement.innerText = 'Choose file';
    this.labelEditGroupPart.nativeElement.innerText = 'Choose file';
    this.showDeleteBtnAddImage = false;
    this.showDeleteBtnEditImage = false;
  }

  hideAddGroupPartModal() {
    this.onInitFormAddGroupPart();
    this.labelAddGroupPart.nativeElement.innerText = 'Choose file';
  }

  hideEditGroupPartModal() {
    this.onInitFormEditGroupPart();
    this.labelEditGroupPart.nativeElement.innerText = 'Choose file';
  }

  /** CALL API */
  reloadData() {
    this.getListGroupParts();
  }

  getListGroupParts(numberPage: number = 1) {
    // this.spinner.show();
    this.partManagementService.getListGroupPart(numberPage).subscribe(
      (result) => {
        this.spinner.hide();
        if (result.status === 200) {
          this.groupParts = result.data;
          this.noPart = result.from;
          this.total = result.total;
          this.pageSize = result.per_page;
          if (!result.data?.length) {
            this.noData = true;
            this.resultNoData = false;
          } else {
            this.noData = false;
            this.resultNoData = false;
          }
        } else {
          this.noData = true;
          this.resultNoData = false;
        }
      },
      (error) => {
        // this.spinner.hide();
        this.noData = true;
        this.resultNoData = false;
      }
    );
  }

  search(codeNumber: string): void {
    this.resultNoData = false;
    // this.spinner.show();
    this.partManagementService.searchGroupPart(codeNumber).subscribe(
      (result) => {
        // this.spinner.hide();
        if (result.status === 200) {
          this.groupParts = result.data;
          this.total = result.total;
          this.pageSize = result.per_page;
        }
      },
      (error) => {
        // this.spinner.hide();
      }
    );
  }

  uploadImagePart(option: string) {
    if (option == 'add') {
      this.isAddSubmitted = true;
      if (this.addGroupPartForm.invalid) {
        return;
      }
      if (this.addGroupPartImgURL === '') {
        this.addGroupParts(null);
        return;
      }
    } else {
      this.isEditSubmitted = true;
      if (this.editGroupPartForm.invalid) {
        return;
      }

      if ((this.editGroupPartImgURL === '') || (this.currentImage === this.editGroupPartImgURL)) {
        this.updateGroupPart(null);
        return;
      }
    }

    // this.spinner.show();
    this.partManagementService.uploadImageGroupPart(option === 'add' ? this.addFileToUpload : this.editFileToUpload)
      .subscribe(
        (result) => {
          // this.spinner.hide();
          if (result.status == 200) {
            if (option === 'add') {
              this.addGroupParts(result.data)
            }
            else {
              this.updateGroupPart(result.data, true);
            }
          } else {
            if (option === 'add') {
              this.dialog.show(this.msgAddPartFail, "error");
              this.addGroupPartModal.hide();
            }
            else {
              this.dialog.show(this.msgAddPartFail, "error");
              this.editGroupPartsModal.hide();
            }
          }
        },
        (error) => {
          // this.spinner.hide();
          if (option === 'add') {
            this.dialog.show(this.msgAddPartFail, "error");
            this.addGroupPartModal.hide();
          }
          else {
            this.dialog.show(this.msgAddPartFail, "error");
            this.editGroupPartsModal.hide();
          }
        }
      );
  }

  addGroupParts(image: string) {
    // this.spinner.show();
    this.partManagementService.addGroupParts(this.addGroupPartForm.value, image)
      .subscribe(
        (result) => {
          // this.spinner.hide();
          if (result.status == 200) {
            this.getListGroupParts(this.page);
            this.dialog.show(this.msgAddPartSuccess, "success");
            this.addGroupPartModal.hide();
          } else {
            if (result.code == 'C019') {
              this.duplicateID = true;
              return;
            }
            else {
              this.dialog.show(this.msgAddPartFail, "error");
            }
            this.addGroupPartModal.hide();
          }
        },
        (error) => {
          // this.spinner.hide();
          this.dialog.show(this.msgAddPartFail, "error");
          this.addGroupPartModal.hide();
        }
      );
  }

  updateGroupPart(image: string, isUpload = false) {
    if (isUpload) {
      this.editGroupPartForm.patchValue({
        groupPartImage: image
      })
    }
    // this.spinner.show();
    this.partManagementService.updateGroupPart(this.groupPart.id, this.editGroupPartForm.value, this.editGroupPartForm.value.groupPartImage)
      .subscribe(
        (result) => {
          // this.spinner.hide();
          if (result.status == 200) {
            this.getListGroupParts(this.page);
            this.dialog.show(this.msgEditPartSuccess, "success");
            this.editGroupPartsModal.hide();
          } else {
            if (result.code == 'C019') {
              this.duplicateID = true;
              return;
            } else {
              this.dialog.show(this.msgEditPartFail, "error");
            }
            this.editGroupPartsModal.hide();
          }
        },
        (error) => {
          // this.spinner.hide();
          this.dialog.show(this.msgEditPartFail, "error");
          this.editGroupPartsModal.hide();
        }
      );
  }

  deleteGroupPart() {
    // this.spinner.show();
    this.partManagementService.deleteGroupPart(this.idPart).subscribe(
      (result) => {
        // this.spinner.hide();
        if (result.status == 200) {
          this.getListGroupParts(this.page);
          this.dialog.show(this.msgDeleteSuccess, 'success');
        } else {
          this.dialog.show(this.msgDeleteFail, 'error');
        }
      },
      (error) => {
        // this.spinner.hide();
        this.dialog.show(this.msgDeleteFail, 'error');
      }
    );
  }
}
