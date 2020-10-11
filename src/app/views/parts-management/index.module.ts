import { NgModule } from '@angular/core';
import { IndexComponent } from './index.component';
import { IndexRoutingModule } from './index-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CommonModule } from '@angular/common';
//Import module pagination
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../components/dialog/dialog.module';
import { DialogCSVModule } from '../../components/dialog-csv/dialog-csv.module';
import { InputFilterDirective } from '../../_directive';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  imports: [
    CommonModule,
    IndexRoutingModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    DialogModule,
    DialogCSVModule,
    NgxSpinnerModule
  ],
  declarations: [ IndexComponent, InputFilterDirective ]
})
export class IndexModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
