import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Vendor } from '../models/vender.model';
import { CodeResponse } from '../models/code.dto';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  
  private baseUrl: string = `${environment.apiUrl}/vendors`;

  constructor(private http: HttpClient) {}

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.baseUrl);
  }

  getVendorById(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.baseUrl}/${id}`);
  }

  getNextVendorCode(): Observable<CodeResponse> {
      return this.http.get<CodeResponse>(`${this.baseUrl}/next-vendor-code`);
  }
  
  createVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(this.baseUrl, vendor);
  }

  updateVendor(id: number, vendor: Vendor): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/${id}`, vendor);
  }

  deleteVendor(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}
