import { Material } from "./material.model";
import { PurchaseOrder } from "./purchase-order.model";

export interface PurchaseOrderDetail {
    id?: number;
    orderId: number;
    materialId: number;
    itemQuantity: number;
    itemRate: number;
    itemNotes?: string;
    expectedDate?: Date;
    purchaseOrder?: PurchaseOrder;
    material?: Material;
    code?: string;
    unit?: string;
    shortText?: string;
  }
  