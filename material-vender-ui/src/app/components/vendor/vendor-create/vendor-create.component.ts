import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from 'src/app/services/vender.service';

@Component({
  selector: 'app-vendor-create',
  templateUrl: './vendor-create.component.html',
  styleUrls: ['./vendor-create.component.css'],
})
export class VendorCreateComponent implements OnInit {
  vendorForm!: FormGroup;
  isSubmitting: boolean = false;
  nextVendorCode: any = 'VD0001';

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.vendorService.getNextVendorCode().subscribe(result => {
      this.nextVendorCode = result.code;
      this.vendorForm.patchValue({
        code: this.nextVendorCode
      })
    })
  }

  private initializeForm(): void {
    this.vendorForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      addressLine1: [''],
      addressLine2: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactNo: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.maxLength(10),
        ],
      ],
      validTillDate: [''],
      isActive: [true, Validators.required],
    });

    this.vendorForm.get('code')?.disable();
  }

  get formControls() {
    return this.vendorForm.controls;
  }

  onSubmit(): void {
    if (this.vendorForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const vendor = this.vendorForm.value;
    vendor.code = this.nextVendorCode;
    console.log(vendor);

    this.vendorService.createVendor(vendor).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Vendor created successfully!');
        this.router.navigate(['/vendors']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating vendor:', error);
        alert('Failed to create vendor. Please try again.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/vendors']);
  }
}
