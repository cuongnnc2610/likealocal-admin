import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserPaymentAddressService {

  constructor(private http: HttpClient) { }

  getUserPaymentAddressListByAdmin(user_id: number) {
    return this.http.get<any>(`${environment.apiUrl}/user-payment-address?user_id=${user_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getUserPaymentAddressListByUser() {
    return this.http.get<any>(`${environment.apiUrl}/user-payment-address/all`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createUserPaymentAddress(user_id: number, user_payment_address: any, country_id: number) {
    return this.http.post<any>(`${environment.apiUrl}/user-payment-address`, {
      user_id: Number(user_id),
      country_id: Number(country_id),
      name: user_payment_address.name,
      phone_number: user_payment_address.phone_number,
      postal_code: user_payment_address.postal_code,
      address: user_payment_address.address,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateUserPaymentAddress(id: number, user_payment_address: any, country_id) {
    return this.http.put<any>(`${environment.apiUrl}/user-payment-address/${id}`, {
      country_id: Number(country_id),
      name: user_payment_address.name,
      phone_number: user_payment_address.phone_number,
      postal_code: user_payment_address.postal_code,
      address: user_payment_address.address,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteUserPaymentAddress(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/user-payment-address/${id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
