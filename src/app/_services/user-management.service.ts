import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private http: HttpClient) { }

  getCountryList() {
    return this.http.get<User[]>(`${environment.apiUrl}/countries`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getUserList(numberPage: number, name: string, email: string, phone_number: string) {
    return this.http.get<User[]>(`${environment.apiUrl}/users/list?page=${numberPage}&name=${name}&email=${email}&phone_number=${phone_number}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getUser(user_id: number) {
    return this.http.get<User>(`${environment.apiUrl}/users/${user_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createUser(user: any, user_payment_addresses, country_id: number) {
    return this.http.post<User>(`${environment.apiUrl}/users/register`, {
      email: user.email,
      company: user.company,
      country_id: Number(country_id),
      name: user.name,
      phone_number: user.phone_number,
      postal_code: user.postal_code,
      address: user.address,
      user_payment_addresses: user_payment_addresses,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateUser(id: number, user: any, country_id) {
    return this.http.put<any>(`${environment.apiUrl}/users/${id}`, {
      email: user.email,
      company: user.company,
      country_id: Number(country_id),
      name: user.name,
      phone_number: user.phone_number,
      postal_code: user.postal_code,
      address: user.address,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/users/${id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
