import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model';
import { environment } from 'src/environments/environment.development';
import { CodeResponse } from '../models/code.dto';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  
  private baseUrl: string = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) {}

  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.baseUrl);
  }

  getMaterialById(id: number): Observable<Material> {
    return this.http.get<Material>(`${this.baseUrl}/${id}`);
  }

  getNextMaterialCode(): Observable<CodeResponse> {
    return this.http.get<CodeResponse>(`${this.baseUrl}/next-material-code`);
  }

  createMaterial(material: Material): Observable<Material> {
    return this.http.post<Material>(this.baseUrl, material);
  }

  updateMaterial(id: number, material: Material): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/${id}`, material);
  }

  deleteMaterial(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}
