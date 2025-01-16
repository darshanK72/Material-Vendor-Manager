import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorService } from 'src/app/services/vender.service';

@Component({
  selector: 'app-vendor-update',
  templateUrl: './vendor-update.component.html',
  styleUrls: ['./vendor-update.component.css'],
})
export class VendorUpdateComponent implements OnInit {
  vendorUpdateForm!: FormGroup;
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  vendorId: number = 0;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.vendorId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.initializeForm();
    this.loadVendor();
  }

  private initializeForm(): void {
    this.vendorUpdateForm = this.fb.group({
      id: [0],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      addressLine1: ['', Validators.maxLength(200)],
      addressLine2: ['', Validators.maxLength(200)],
      contactEmail: ['', Validators.email],
      contactNo: ['', Validators.pattern('^[0-9]+$')],
      validTillDate: [null],
      isActive: [true, Validators.required],
    });
  }


  private loadVendor(): void {
    if (this.vendorId <= 0) {
      this.router.navigate(['/vendors']);
      return;
    }

    this.vendorService.getVendorById(this.vendorId).subscribe({
      next: (vendor) => {
        this.vendorUpdateForm.patchValue({
          ...vendor,
          validTillDate : this.formatDate(vendor.validTillDate || new Date())
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendor:', error);
        alert('Failed to load vendor details. Please try again.');
        this.router.navigate(['/vendors']);
      },
    });
  }

  private formatDate(date:Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  get formControls() {
    return this.vendorUpdateForm.controls;
  }

  onSubmit(): void {
    if (this.vendorUpdateForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const vendor = this.vendorUpdateForm.value;

    this.vendorService.updateVendor(this.vendorId, vendor).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Vendor updated successfully!');
        this.router.navigate(['/vendors']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating vendor:', error);
        alert('Failed to update vendor. Please try again.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/vendors']);
  }
}
