import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Order } from '../_models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  constructor(private http: HttpClient) { }

  getOrderList(numberPage: number, order_number: string, email: string, phone_number: string, date: string) {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders?page=${numberPage}&order_number=${order_number}&email=${email}&phone_number=${phone_number}&date=${date}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getOrder(order_id: number) {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/${order_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
