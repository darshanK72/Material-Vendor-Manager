export interface PurchaseOrder {
  id?: number;
  orderNumber: string;
  orderDate: Date;
  vendorId: number;
  notes: string;
  orderValue: number;
  orderStatus: string;
  details: PurchaseOrderDetail[];
}

export interface PurchaseOrderDetail {
  id?: number;
  orderId: number;
  materialId: number;
  itemQuantity: number;
  itemRate: number;
  itemValue: number;
  itemNotes: string;
  expectedDate: Date;
}