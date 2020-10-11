import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../_models';
import { OrderManagementService } from '../../../_services';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from '../../../components';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-detail-management',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;

  public order: any;
  public order_id: number;
  
  constructor(
    private route: ActivatedRoute,
    private orderManagementService: OrderManagementService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.order_id = params['order_id'];
    });
  }

  ngOnInit(): void {
    this.order = new Order();
    this.order.user = { email: null, name: null };
    this.order.createdAt = '';
    this.order.items = [];
    this.translateLang();
    this.getOrder();
  }

  //TRANSLATE
  translateLang() {
    this.translate.addLangs(['en', 'jp']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      this.translate.use('en');
    else 
      this.translate.use(localStorage.getItem('lang'));
  }

  formatCurrency(value) {
    if (!value) {
      return '';
    }
    return Number(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  /** CALL API */
  getOrder() {
    // this.spinner.show();
    this.orderManagementService.getOrder(this.order_id).subscribe(
      (result) => {
        // this.spinner.hide();
        this.order = result.data;
      },
      (error) => {
        // this.spinner.hide();
        this.dialog.show(error, 'error');
      }
    );
  }
}
