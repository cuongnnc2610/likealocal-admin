import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FileHandle } from './dragDrop.directive';
import { PartsService } from "../../_services/parts.service";

@Component({
  selector: 'app-dialog-csv',
  templateUrl: './dialog-csv.component.html',
  styleUrls: ['./dialog-csv.component.css']
})

export class DialogCSVComponent implements OnInit {
  @ViewChild('modalImpCSV') public dialog: ModalDirective;

  @Output()
  public change: EventEmitter<any> = new EventEmitter<any>();
  public files: FileHandle[] = [];
  public file_processing: boolean = false;
  public file_invalid: boolean = false;
  public file_uploading: boolean = false;
  public file_uploaded: boolean = false;
  public file_upload_value: number = 0;
  public file_upload_max: number = 0;
  public file_error: boolean = false;
  public line_message_error = null;
  public file_percent: number = 0

  constructor(
    private partsService: PartsService
  ) { }

  ngOnInit(): void {}

  show() {
    this.dialog.config = {
      backdrop: 'static',
      keyboard: false
    }
    this.dialog.show();
  }

  hideModal() {
    document.body.classList.remove('modal-open');
    const modalContainer = document.querySelector('modal-container');
    if (modalContainer !== null)
      modalContainer.parentNode.removeChild(modalContainer);
  }

  hide() {
    this.dialog.hide();
  }

  filesDropped(files: FileHandle[]): void {
    if(files.length > 0){
      var regex = new RegExp(/.+(\.csv)$|.+(\.CSV)$/);
      let filename = files[0].file.name;
      if( regex.test(filename)){
        this.files = files; 
      }
    }
  }

  upload() {
    if(this.files.length > 0){
      if( this.files[0].file.size == 0){
        this.line_message_error = "Invalid data exists in CSV";
        return;
      }
    }else{
      this.line_message_error = "Please choose a file CSV";
      return;
    }

    const formData = new FormData();
    let file = this.files[0];
    formData.append('file', file.file);
    this.file_uploaded = false;
    this.file_upload_value = 0;
    this.file_upload_max = 0;
    this.partsService.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.loaded >= event.total) {
              this.file_uploading = false;
              this.file_processing = true;
            } else {
              this.file_uploading = true;
              this.file_processing = false;
            }

            setTimeout(() => {
              this.file_upload_value = event.loaded;
              this.file_upload_value = event.total;
              this.file_percent = Math.round(event.loaded * 100 / event.total);
            }, 1000);
            break;
          case HttpEventType.Response:
             this.file_uploading = false;
            if (event.status == 200) {
              const { status } = event.body;
              if (status == 400) {
                // upload failed
                this.line_message_error = "Invalid data exists in CSV";
                this.file_processing = true;
              } else {
                // upload done
                this.file_uploaded = true;
                this.line_message_error = null;
              }
            } else {
              this.line_message_error = "Network Error. Please try check internet connection.";
            }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // file.inProgress = false;
        this.file_uploading = false;
        return of(`Upload failed: ${file.file.name}`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {}
      });
  }

  removeFile() {
    this.files = [];
    this.file_uploading = false;
    this.file_upload_value = 0;
    this.file_upload_max = 0;
    this.file_uploaded = false;
    this.line_message_error = null;
    this.file_invalid = false;
    this.file_processing = false;
    this.file_percent = 0;
  }

  chooseFile(e) {}

  doneUploadFile() {
    this.file_upload_value = 0;
    this.file_upload_max = 0;
    this.removeFile();
    this.dialog.hide();
    this.change.emit({status: 1});
  }
}
