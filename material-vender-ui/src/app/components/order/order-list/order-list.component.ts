import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  paginatedOrders: PurchaseOrder[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getPurchaseOrders().subscribe((result) => {
      this.orders = result;
      this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
      this.updatePaginatedOrders();
      this.isLoading = false;
    });
  }

  updatePaginatedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrders();
    }
  }

  updateOrder(orderId: number): void {
    this.router.navigate(['orders/update', orderId]);
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['orders/details', orderId]);
  }

  deleteOrder(orderId: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this order?'
    );
    if (confirmDelete) {
      this.orderService.deletePurchaseOrder(orderId).subscribe({
        next : (result) => {
          this.fetchOrders();
      },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
}
