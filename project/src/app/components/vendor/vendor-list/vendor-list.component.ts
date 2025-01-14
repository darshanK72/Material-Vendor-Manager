import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../services/vendor.service';
import { Vendor } from '../../../models/vendor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent implements OnInit {
  vendors: Vendor[] = [];

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.vendorService.getVendors().subscribe(
      data => this.vendors = data
    );
  }

  createVendor(): void {
    this.router.navigate(['/vendors/create']);
  }

  editVendor(id: number): void {
    this.router.navigate(['/vendors/edit', id]);
  }

  deleteVendor(id: number): void {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.vendorService.deleteVendor(id).subscribe(
        () => this.loadVendors()
      );
    }
  }
}