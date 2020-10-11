import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartManagementService {

  constructor(private http: HttpClient) { }
  
  getListAllGroupPart() {
    return this.http.get<any>(`${environment.apiUrl}/part/all`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getListGroupPart(numberPage: number) {
    return this.http.get<any>(`${environment.apiUrl}/part?page=${numberPage}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  searchGroupPart(codeNumber: string) {
    return this.http.get<any>(`${environment.apiUrl}/part?code_number=${codeNumber}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  addGroupParts(product: any, image: string = null, modelId: number = 1) {
    return this.http.post<any>(`${environment.apiUrl}/part`, { code_number: `${product.groupPartCode}`, name: `${product.groupPartName}`, image: `${image}`, model_id: modelId })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  uploadImageGroupPart(imageFile: any) {
    const formData: FormData = new FormData();
    formData.append('file', imageFile, imageFile?.name);
    return this.http.post<any>(`${environment.apiUrl}/part/images`, formData)
      .pipe(map((result: any) => {
        return result;
      }))
  }

  updateGroupPart(id: number, product: any, image: string = null, modelId: number = 1) {
    return this.http.put<any>(`${environment.apiUrl}/part/${id}`,
      image !== null ? { code_number: `${product.groupPartCode}`, name: `${product.groupPartName}`, image: image, model_id: modelId } : { code_number: `${product.groupPartCode}`, name: `${product.groupPartName}`, model_id: modelId })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteGroupPart(id: any) {
    return this.http.delete<any>(`${environment.apiUrl}/part/${id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
