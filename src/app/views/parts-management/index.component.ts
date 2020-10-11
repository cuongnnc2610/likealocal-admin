import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PartsService, PartManagementService } from "../../_services";
import { Part, GroupPart } from "../../_models";
import { TranslateService } from "@ngx-translate/core";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DialogComponent, DialogCSVComponent } from '../../components';
import { NgxSpinnerService } from 'ngx-spinner';

interface Search {
  group: string;
  code: string;
  name: string;
}

@Component({
  selector: "app-parts",
  templateUrl: "./index.component.html",
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {
  @ViewChild('modalConfirmDel') modalConfirmDel: ModalDirective;
  @ViewChild('modalAddPart') modalAddPart: ModalDirective;
  @ViewChild('modalEditPart') modalEditPart: ModalDirective;
  @ViewChild('modalDetailsPart') modalDetailsPart: ModalDirective;
  @ViewChild('modalImpCSV') modalImpCSV: ModalDirective;
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild(DialogCSVComponent) dialogCSV: DialogCSVComponent;
  @ViewChild("labelAdd") labelAdd: ElementRef;
  @ViewChild("labelEdit") labelEdit: ElementRef;

  public partModal: Part;
  public message: string;
  public searchObj: Search = { group: "", code: "", name: "", };
  public parts: Part[] = [];
  public part: Part;
  public groupParts: GroupPart[];
  public total: any; // total number of products
  public pageSize: number; // The number of items per page.
  public page: number = 1; //The current page. Default is 1\
  public fromNo: number = 0;
  public items: any[] = [
    { id: 1, name: 'one' },
    { id: 2, name: 'two' },
    { id: 3, name: 'three' },
    { id: 4, name: 'four' },
    { id: 5, name: 'five' },
    { id: 6, name: 'six' }
  ];
  public selected: number = 1;
  selectOption(id: number) { }

  public addfileToUpload: File = null;
  public editfileToUpload: File = null;

  public detailPartsForm: FormGroup;
  public editPartForm: FormGroup;
  public addPartForm: FormGroup;
  public isEditSubmitted = false;
  public isAddSubmitted = false;

  public existed_code_number = false;
  public existed_image_number = false;

  public controlConfigs = {
    id: ['', []],
    part_id: ['', [Validators.required]],
    code_number: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]+$'), Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(64)]],
    quantity: ['', [Validators.required, Validators.min(1), Validators.maxLength(15)]],
    usd_price: ['', [Validators.required, Validators.min(1), Validators.maxLength(20)]],
    remark: ['', [Validators.maxLength(64)]],
    parts_image_number: ['', [Validators.required, Validators.min(1), Validators.maxLength(15)]],
    jpy_price: ['0'],
  }

  constructor(
    private partsService: PartsService,
    private partService: PartManagementService,
    public translate: TranslateService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getListParts();
    this.validateForm();
    this.translateLang();
    this.validateFormDetails();
    this.getListAllGroupPart();
  }

  validateForm() {
    this.addPartForm = this.fb.group(this.controlConfigs);
    this.editPartForm = this.fb.group(this.controlConfigs)
  }

  validateFormDetails() {
    this.detailPartsForm = this.fb.group({
      id: ['', []],
      part_id: [],
      code_number: [],
      name: ['', []],
      quantity: ['', []],
      usd_price: ['', []],
      jpy_price: ['', []],
      parts_image_number: ['', []],
      remark: ['', []]
    })
  }


  get formAdd() {
    return this.addPartForm.controls;
  }

  get formEdit() {
    return this.editPartForm.controls;
  }

  formatCurrency(value) {
    if (!value)
      return '';
    return Number(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  onFileAddChange(files: FileList) {
    this.labelAdd.nativeElement.innerText = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    this.addfileToUpload = files.item(0);
  }

  onFileEditChange(files: FileList) {
    this.labelEdit.nativeElement.innerText = Array.from(files).map((f) => f.name).join(", ");
    this.editfileToUpload = files.item(0);
  }

  resetFormAdd() {
    this.isAddSubmitted = false;
    this.addPartForm.reset();
  }
  resetFormEdit() {
    this.isEditSubmitted = false;
    this.editPartForm.reset();
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
    this.getListParts(data);
  }

  getListParts(numberPage: number = 1) {
    // this.spinner.show();
    this.partsService.getListParts(numberPage, this.searchObj).subscribe(
      (result) => {
        this.spinner.hide();
        this.parts = result.data;
        this.total = result.total;
        this.pageSize = result.per_page;
        this.fromNo = result.from;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getListAllGroupPart() {
    // this.spinner.show();
    this.partService.getListAllGroupPart().subscribe(
      (result) => {
        this.spinner.hide();
        this.groupParts = result.data;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  //FILTERS
  searchParts(): void {
    this.getListParts(this.page);
  }

  searchClear() {
    this.searchObj.group = "";
    this.searchObj.code = "";
    this.searchObj.name = "";
    this.getListParts(this.page);
  }
  onSubmitAdd() {
    this.isAddSubmitted = true;
    if (!this.addPartForm.valid) {
      return false;
    } else {
      this.existed_image_number = false;
      this.existed_code_number = false;

      let { code_number, name, quantity, usd_price, parts_image_number, part_id, remark } = this.addPartForm.value;

      let partData = {
        code_number: code_number,
        name: name,
        quantity: Number(quantity),
        part_id: Number(part_id),
        jpy_price: 0,
        usd_price: Number(usd_price),//isNaN( Number(usd_price) ) ? Number(usd_price.replace(/,/g, '')) : Number(usd_price),
        parts_image_number: parts_image_number,
        remark: remark || ""
      }
      // console.log(partData);
      this.addParts(<Part>partData);
    }
  }

  //CRUD PRODUCT
  addParts(part: Part) {
    this.existed_image_number = false;
    this.existed_code_number = false;
    // this.spinner.show();
    this.partsService.addParts(part)
      .subscribe(result => {
        this.spinner.hide();
        if (result.status == 200) {
          this.modalAddPart.hide();
          this.dialog.show("The parts has been added", "success");
          this.resetFormAdd();
          this.getListParts(this.page);
        } else {
          // result.status == 400
          if (result.code == "C025")
            this.existed_image_number = true;

          if (result.code == "C022")
            this.existed_code_number = true;
        }

      }, (error) => {
        this.spinner.hide();
        this.dialog.show("Network error", "error");
      });
  }

  detailParts(part: Part) {
    // this.spinner.show();
    this.partsService.getPartsById(part.id).subscribe(
      (result) => {
        this.spinner.hide();
        this.part = result.data;
        this.detailPartsForm.setValue({
          id: part.id,
          name: part.name,
          code_number: part.code_number,
          quantity: part.quantity,
          jpy_price: 0,
          usd_price: Number(part.usd_price),
          parts_image_number: part.parts_image_number,
          part_id: part.part_id,
          remark: part.remark || ""
        });
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show("Network error", "error");
      }
    );
  }

  onSubmitUpdate() {
    this.isEditSubmitted = true;
    if (!this.editPartForm.valid) {
      return;
    } else {
      this.existed_image_number = false;
      this.existed_code_number = false;
      let { id, code_number, name, quantity, usd_price, parts_image_number, part_id, remark } = this.editPartForm.value;
      let partData = {
        id: Number(id),
        code_number: code_number,
        name: name,
        quantity: Number(quantity),
        part_id: Number(part_id),
        jpy_price: 0,
        usd_price: Number(usd_price),
        parts_image_number: parts_image_number,
        remark: remark || ""
      }
      this.updateParts(<Part>partData);
    }
  }

  editParts(part: Part) {
    // this.spinner.show();
    this.partsService.getPartsById(part.id).subscribe(
      (result) => {
        this.spinner.hide();
        this.part = result.data;
        const { id, name, code_number, quantity, usd_price, parts_image_number, part_id, remark } = this.part;
        this.editPartForm.patchValue({
          id: id,
          name: name,
          code_number: code_number,
          quantity: quantity,
          jpy_price: 0,
          usd_price: Number(usd_price),
          parts_image_number: parts_image_number,
          part_id: part_id,
          remark: remark || ""
        });
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show("Network error", "error");
      }
    );
  }

  updateParts(part: Part) {
    this.existed_image_number = false;
    this.existed_code_number = false;
    // this.spinner.show();
    this.partsService.updateParts(part).subscribe(
      result => {
        this.spinner.hide();
        if (result.status == 200) {
          this.modalEditPart.hide();
          this.dialog.show("The parts has been edited", "success");
          this.resetFormEdit();
          this.getListParts(this.page);
        } else {
          if (result.code == "C025")
            this.existed_image_number = true;
          if (result.code == "C022")
            this.existed_code_number = true;
        }
      }, (error) => {
        this.spinner.hide();
        this.dialog.show("Network error", "error");
      });
  }

  deleteParts() {
    if (this.modalConfirmDel.isShown) {
      this.modalConfirmDel.hide();
    }
    let pid = this.partModal.id;
    // this.spinner.show();
    this.partsService.deleteParts(pid).subscribe(result => {
      this.spinner.hide();
      if (result.status == 200) {
        this.getListParts(this.page);
        this.dialog.show('The parts has been deleted', 'success');
      } else {
        this.dialog.show('The parts has been deleted failure.', 'error');
      }
    }, (error) => {
      this.spinner.hide();
      this.dialog.show("Network error", "error");
    });
  }

  openModalConfirmDel(part: Part) {
    this.partModal = part;
    this.modalConfirmDel.show();
  }

  openModalAdd() {
    this.modalAddPart.show();
  }

  closeModalAdd() {
    this.existed_code_number = false;
    this.existed_image_number = false;
    this.addPartForm.patchValue({
      id: '',
      name: '',
      code_number: '',
      quantity: '',
      jpy_price: 0,
      usd_price: '',
      parts_image_number: '',
      part_id: '',
      remark: ''
    });
    this.addPartForm.reset();
    this.modalAddPart.hide();
  }

  openModalEdit(part: Part) {
    this.modalEditPart.show();
    this.editParts(part);
  }

  closeModalEdit() {
    this.existed_code_number = false;
    this.existed_image_number = false;
    this.editPartForm.reset();
    this.modalEditPart.hide();
  }

  openModalDetailsPart(part: Part) {
    this.modalDetailsPart.show();
    this.detailParts(part);
  }

  openModalImpCSV() {
    this.dialogCSV.show();
  }


  inputDigitOnly(e: any) {
    // console.log(e);
    var keyCode = e.which ? e.which : e.keyCode
    var specialKeys = new Array();
    specialKeys.push(8); //Backspace
    if (specialKeys.indexOf(keyCode) != -1) {
      return true;
    }

    var reg = new RegExp('^[0-9]$');
    return reg.test(e.key);
  }

  uploadCSVDone(e: any) {
    this.getListParts(this.page);
  }

  exportCSV() {
    // this.spinner.show();
    this.partsService.export().subscribe(
      (result) => {
        this.spinner.hide();
        const blob = new Blob(['\ufeff', result], { type: 'application/vnd.ms-excel' });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'parts_export_' + new Date().toLocaleDateString() + '.csv';
        link.click();
      },
      (error) => {
        this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }
}
