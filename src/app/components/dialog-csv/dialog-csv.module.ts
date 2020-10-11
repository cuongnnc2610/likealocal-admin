
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogCSVComponent } from './dialog-csv.component';
import { DragDirective } from './dragDrop.directive';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
  declarations: [
    DialogCSVComponent,
    DragDirective
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
  ],
  exports: [DialogCSVComponent]
})
export class DialogCSVModule { }
