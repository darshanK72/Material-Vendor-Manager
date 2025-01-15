import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/services/material.service';
import { Material } from 'src/app/models/material.model';
import { Vendor } from 'src/app/models/vender.model';
import { VendorService } from 'src/app/services/vender.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css'],
})
export class OrderCreateComponent implements OnInit {
  orderForm!: FormGroup;
  vendors: Vendor[] = [];
  materials: Material[] = [];
  addedItems: any[] = [];
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private vendorService: VendorService,
    private purchaseOrderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadVendors();
    this.loadMaterials();
  }

  private initializeForm(): void {
    this.orderForm = this.fb.group({
      orderNumber: ['', [Validators.required]],
      orderDate: ['', Validators.required],
      vendorId: ['', Validators.required],
      notes: [''],
      orderValue: [0, Validators.required],
      orderStatus: ['', Validators.required],
      materialId: ['', Validators.required],
      itemQuantity: [0, [Validators.required, Validators.min(1)]],
      itemRate: [0, [Validators.required, Validators.min(1)]],
    });
  }

  get formControls() {
    return this.orderForm.controls;
  }

  private loadVendors(): void {
    this.vendorService.getVendors().subscribe((vendors: Vendor[]) => {
      this.vendors = vendors;
    });
  }

  private loadMaterials(): void {
    this.materialService.getMaterials().subscribe((materials: Material[]) => {
      this.materials = materials;
    });
  }

  addItem(): void {
    const newItem = {
      material: this.materials.find(
        (m) => m.id === this.formControls['materialId'].value
      ),
      itemQuantity: this.formControls['itemQuantity'].value,
      itemRate: this.formControls['itemRate'].value,
    };

    if (newItem.material && newItem.itemQuantity > 0 && newItem.itemRate > 0) {
      this.addedItems.push(newItem);

      // Reset the item entry form for next item
      this.orderForm.patchValue({
        materialId: '',
        itemQuantity: 0,
        itemRate: 0,
      });
    }
  }

  removeItemFromTable(index: number): void {
    this.addedItems.splice(index, 1); // Remove from the addedItems table
  }

  onSubmit(): void {
    if (this.orderForm.invalid || this.addedItems.length === 0) {
      return;
    }

    this.isSubmitting = true;
    const order = this.orderForm.value;

    // Assuming addedItems need to be included in the order before submitting
    order.purchaseOrderDetails = this.addedItems;

    this.purchaseOrderService.createPurchaseOrder(order).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Purchase Order created successfully!');
        this.router.navigate(['/purchase-orders']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating purchase order:', error);
        alert('Failed to create purchase order. Please try again.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/purchase-orders']);
  }
}
