import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  paginatedOrders: PurchaseOrder[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5; // Number of items per page
  totalPages: number = 1;

  constructor(private router:Router) {
    
  }

  ngOnInit(): void {
    // Fetch orders (replace with API call)
    this.fetchOrders();
  }

  fetchOrders(): void {
    // Simulated data (replace with a service call to fetch from backend)
    this.orders = [
      { id: 1, orderNumber: 'ORD001', orderDate: new Date(), vendorId: 1, orderValue: 5000, orderStatus: 'Pending', vendor: {
        id: 1, name: 'Vendor 1',
        code: '',
        isActive: false
      } },
      { id: 2, orderNumber: 'ORD002', orderDate: new Date(), vendorId: 2, orderValue: 12000, orderStatus: 'Completed', vendor: {
        id: 2, name: 'Vendor 2',
        code: '',
        isActive: false
      } },
      { id: 3, orderNumber: 'ORD003', orderDate: new Date(), vendorId: 1, orderValue: 8000, orderStatus: 'In Progress', vendor: {
        id: 1, name: 'Vendor 1',
        code: '',
        isActive: false
      } },
      // Add more sample data
      { id: 4, orderNumber: 'ORD004', orderDate: new Date(), vendorId: 3, orderValue: 1500, orderStatus: 'Pending', vendor: {
        id: 3, name: 'Vendor 3',
        code: '',
        isActive: false
      } },
      { id: 5, orderNumber: 'ORD005', orderDate: new Date(), vendorId: 4, orderValue: 7500, orderStatus: 'Completed', vendor: {
        id: 4, name: 'Vendor 4',
        code: '',
        isActive: false
      } },
      { id: 6, orderNumber: 'ORD006', orderDate: new Date(), vendorId: 5, orderValue: 2300, orderStatus: 'Cancelled', vendor: {
        id: 5, name: 'Vendor 5',
        code: '',
        isActive: false
      } },
    ];

    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    this.updatePaginatedOrders();
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

  createOrder(): void {
    alert('Navigate to the Create Order Page'); // Replace with routing logic
  }

  updateOrder(orderId: number): void {
    alert(`Navigate to Update Order Page for Order ID: ${orderId}`); // Replace with routing logic
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/details', orderId]);
  }

  deleteOrder(orderId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this order?');
    if (confirmDelete) {
      this.orders = this.orders.filter((order) => order.id !== orderId);
      this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
      this.currentPage = Math.min(this.currentPage, this.totalPages); // Adjust current page
      this.updatePaginatedOrders();
    }
  }
}