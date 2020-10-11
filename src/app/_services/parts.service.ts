import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Part } from '../_models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartsService {

  constructor(private http: HttpClient) { }

  getListParts(numberPage: number, searchArgs : any = null) {

    let params = new HttpParams();
    params = params.append('page', numberPage.toString());
    if( searchArgs != null ){
      params = params.append('code_number', searchArgs.code.toString());
      params = params.append('part_id', searchArgs.group.toString());
      params = params.append('name', searchArgs.name.toString());
    }
    return this.http.get(`${environment.apiUrl}/parts`, {
      params: params
    })
    .pipe(map((result: any) => {
      return result;
    }));
  }

  getPartsById(pid: number) {
    return this.http.get(`${environment.apiUrl}/parts/${pid}`)
    .pipe(map((result: any) => {
      return result;
    }));
  }


  /** POST: add a new part to the server */
  addParts(part: Part) {
    return this.http.post(`${environment.apiUrl}/parts`, part)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  /** PUT: edit a part to the server */
  updateParts(part: Part) {
    let id = part.id;
    return this.http.put(`${environment.apiUrl}/parts/${id}`, part)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  /** DELETE: delete the hero from the server */
  deleteParts(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/parts/${id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  upload(formData : any){
    return this.http.post<any>(`${environment.apiUrl}/parts/csv`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  export() {
    return this.http.get(`${environment.apiUrl}/parts/export-csv`, {
      responseType: 'arraybuffer'})
    .pipe(map((result: any) => {
      return result;
    }));
    
  }

  exportCSV(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/parts/export-csv`, { responseType: 'blob' });
  }
}
