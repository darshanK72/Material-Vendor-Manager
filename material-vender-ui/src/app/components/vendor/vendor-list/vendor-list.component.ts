import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vendor } from 'src/app/models/vender.model';
import { VendorService } from 'src/app/services/vender.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css'],
})
export class VendorListComponent implements OnInit {
  vendors: Vendor[] = [];
  paginatedVendors: Vendor[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private router: Router, private vendorService: VendorService) { }
  
  ngOnInit(): void {
    this.fetchVendors();
  }

  fetchVendors(): void {
    this.vendorService.getVendors().subscribe(result => {
      this.vendors = result;
      this.totalPages = Math.ceil(this.vendors.length / this.itemsPerPage);
      this.updatePaginatedVendors();
      this.isLoading = false;
    })
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


  updateVendor(vendorId: number): void {
    this.router.navigate(['vendors/update', vendorId]);
  }

  deleteVendor(vendorId: number): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this vendor?'
    );
    if (confirmDelete) {
      this.vendorService.deleteVendor(vendorId).subscribe({
        next : (result) => {
          console.log(result);
          this.fetchVendors();
      },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
}
