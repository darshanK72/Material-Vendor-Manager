import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-details';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  orderId: number = 0;
  purchaseOrder: PurchaseOrder | undefined;
  orderDetails: PurchaseOrderDetail[] = [];

  constructor(private route: ActivatedRoute,private orderService:OrderService) { }

  ngOnInit(): void {
    this.orderId = parseInt(this.route.snapshot.paramMap.get('id') || "0");
    console.log(this.orderId);
    this.fetchOrderDetails(this.orderId);
    console.log(this.purchaseOrder);
    console.log(this.orderDetails);
  }

  fetchOrderDetails(orderId: number): void {
    this.orderService.getPurchaseOrderById(orderId).subscribe({
      next: (result) => {
        this.purchaseOrder = result;
        this.orderDetails = this.purchaseOrder?.purchaseOrderDetails || [];
      }
    })
  }

  goBack(): void {
    window.history.back();
  }
}
