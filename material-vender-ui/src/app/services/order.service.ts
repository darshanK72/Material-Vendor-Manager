import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../models/purchase-order.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  
  private baseUrl: string = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.baseUrl);
  }

  getPurchaseOrderById(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.baseUrl}/${id}`);
  }

  createPurchaseOrder(purchaseOrder: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(this.baseUrl, purchaseOrder);
  }

  updatePurchaseOrder(
    id: number,
    purchaseOrder: PurchaseOrder
  ): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/${id}`, purchaseOrder);
  }

  deletePurchaseOrder(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}
