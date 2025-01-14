import { PurchaseOrderDetail } from "./purchase-order-details";
import { Vendor } from "./vender.model";

export interface PurchaseOrder {
    id: number;
    orderNumber: string;
    orderDate: Date;
    vendorId: number;
    notes?: string;
    orderValue: number;
    orderStatus: string;
    vendor?: Vendor;
    purchaseOrderDetails?: PurchaseOrderDetail[];
  }
  