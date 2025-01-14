import { Component, OnInit } from '@angular/core';
import { Vendor } from 'src/app/models/vender.model';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css'],
})
export class VendorListComponent implements OnInit {
  vendors: Vendor[] = [];
  paginatedVendors: Vendor[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5; // Number of items per page
  totalPages: number = 1;

  ngOnInit(): void {
    // Fetch vendors (replace with API call)
    this.fetchVendors();
  }

  fetchVendors(): void {
    // Simulated data (replace with a service call to fetch from backend)
    this.vendors = [
      {
        id: 1,
        code: 'V001',
        name: 'Vendor 1',
        addressLine1: 'Address 1',
        contactEmail: 'vendor1@example.com',
        contactNo: '1234567890',
        validTillDate: new Date(),
        isActive: true,
      },
      {
        id: 2,
        code: 'V002',
        name: 'Vendor 2',
        addressLine2: 'Address 2',
        contactEmail: 'vendor2@example.com',
        contactNo: '0987654321',
        isActive: false,
      },
      {
        id: 3,
        code: 'V003',
        name: 'Vendor 3',
        addressLine1: 'Address 3',
        validTillDate: new Date(),
        isActive: true,
      },
      // Add more sample data
      {
        id: 4,
        code: 'V004',
        name: 'Vendor 4',
        contactNo: '1231231234',
        isActive: true,
      },
      {
        id: 5,
        code: 'V005',
        name: 'Vendor 5',
        addressLine1: 'Address 5',
        validTillDate: new Date(),
        isActive: false,
      },
      {
        id: 6,
        code: 'V006',
        name: 'Vendor 6',
        addressLine2: 'Address 6',
        contactNo: '4564564567',
        isActive: true,
      },
      {
        id: 7,
        code: 'V007',
        name: 'Vendor 7',
        contactEmail: 'vendor7@example.com',
        isActive: true,
      },
    ];

    this.totalPages = Math.ceil(this.vendors.length / this.itemsPerPage);
    this.updatePaginatedVendors();
  }

  updatePaginatedVendors(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedVendors = this.vendors.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedVendors();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedVendors();
    }
  }

  createVendor(): void {
    alert('Navigate to the Create Vendor Page'); // Replace with routing logic
  }

  updateVendor(vendorId: number): void {
    alert(`Navigate to Update Vendor Page for Vendor ID: ${vendorId}`); // Replace with routing logic
  }

  deleteVendor(vendorId: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this vendor?'
    );
    if (confirmDelete) {
      this.vendors = this.vendors.filter((vendor) => vendor.id !== vendorId);
      this.totalPages = Math.ceil(this.vendors.length / this.itemsPerPage);
      this.currentPage = Math.min(this.currentPage, this.totalPages); // Adjust current page
      this.updatePaginatedVendors();
    }
  }
}
