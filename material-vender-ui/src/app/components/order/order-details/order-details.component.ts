import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-details';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  orderId: number = 0;
  purchaseOrder: PurchaseOrder | undefined;
  orderDetails: PurchaseOrderDetail[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.orderId = parseInt(this.route.snapshot.paramMap.get('id') || "0");
    console.log(this.orderId);
    this.fetchOrderDetails(this.orderId);
    console.log(this.purchaseOrder);
    console.log(this.orderDetails);
  }

  fetchOrderDetails(orderId: number): void {
    const purchaseOrders: PurchaseOrder[] = [
      {
        id: 1,
        orderNumber: 'PO001',
        orderDate: new Date('2025-01-01'),
        vendorId: 101,
        orderValue: 5000,
        orderStatus: 'Pending',
        purchaseOrderDetails: [
          {
            id: 1,
            orderId: 1,
            materialId: 1,
            itemQuantity: 100,
            itemRate: 50,
            itemNotes: 'Urgent order',
            expectedDate: new Date('2025-01-10'),
            material: { id: 1, code: 'M001', shortText: 'Material 1', unit: 'kg', reorderLevel: 20, minOrderQuantity: 50, isActive: true }
          },
          {
            id: 2,
            orderId: 1,
            materialId: 2,
            itemQuantity: 200,
            itemRate: 25,
            expectedDate: new Date('2025-01-15'),
            material: { id: 2, code: 'M002', shortText: 'Material 2', unit: 'm', reorderLevel: 30, minOrderQuantity: 100, isActive: true }
          }
        ]
      },
    ];

    this.purchaseOrder = purchaseOrders.find(order => order.id === orderId);
    this.orderDetails = this.purchaseOrder?.purchaseOrderDetails || [];
  }

  goBack(): void {
    window.history.back();
  }
}
