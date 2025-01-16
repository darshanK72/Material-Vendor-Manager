import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/services/material.service';
import { Material } from 'src/app/models/material.model';
import { Vendor } from 'src/app/models/vender.model';
import { VendorService } from 'src/app/services/vender.service';
import { OrderService } from 'src/app/services/order.service';
import { PurchaseOrderDetail } from 'src/app/models/purchase-order-details';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css'],
})
export class OrderCreateComponent implements OnInit {
  orderHeaderForm!: FormGroup;
  materialLineForm!: FormGroup;
  vendors: Vendor[] = [];
  materials: Material[] = [];
  orderLines: PurchaseOrderDetail[] = [];
  isSubmitting: boolean = false;
  totalOrderValue: number = 0;
  editingLineIndex: number | null = null;
  selectedMaterial: Material | null = null;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private vendorService: VendorService,
    private purchaseOrderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadVendors();
    this.loadMaterials();
    this.setupMaterialChangeListener();
  }

  private initializeForms(): void {
    this.orderHeaderForm = this.fb.group({
      orderNumber: ['', [Validators.required]],
      orderDate: [new Date().toISOString().split('T')[0], Validators.required],
      vendorId: ['', Validators.required],
      notes: [''],
      orderValue: [{ value: 0, disabled: true }],
      orderStatus: ['Draft'],
    });

    this.materialLineForm = this.fb.group({
      id:[''],
      materialId: ['', Validators.required],
      itemQuantity: [{ value: 0, disabled: false }, [Validators.required]],
      itemRate: [null, [Validators.required, Validators.min(0.01)]],
      expectedDate: [new Date().toISOString().split('T')[0]],
    });
  }

  onMaterialSelect(event: any) {
    let materialId = event.target.value;
    const material = this.materials.find((m) => m.id === parseInt(materialId));
    this.selectedMaterial = material || null;
    this.materialLineForm.patchValue({
      itemQuantity: material?.minOrderQuantity,
    });
    
  }

  private setupMaterialChangeListener(): void {
    this.materialLineForm
      .get('materialId')
      ?.valueChanges.subscribe((materialId) => {
        if (materialId) {
          const material = this.materials.find((m) => m.id === materialId);
          if (material) {
            this.selectedMaterial = material;
            this.materialLineForm.patchValue({
              itemQuantity: material.minOrderQuantity,
            });

            // Update validators for quantity
            this.materialLineForm
              .get('itemQuantity')
              ?.setValidators([
                Validators.required,
                Validators.min(material.minOrderQuantity),
              ]);
            this.materialLineForm.get('itemQuantity')?.updateValueAndValidity();
          }
        } else {
          this.selectedMaterial = null;
        }
      });
  }

  get orderControls() {
    return this.orderHeaderForm.controls;
  }

  get materialControls() {
    return this.materialLineForm.controls;
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

  addMaterialLine(): void {
    if (this.materialLineForm.invalid) {
      Object.keys(this.materialControls).forEach((key) => {
        const control = this.materialControls[key];
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const formValue = this.materialLineForm.value;
    const material = this.materials.find((m) => m.id === parseInt(formValue.materialId));

    if (!material) return;

    const newLine: PurchaseOrderDetail = {
      orderId: 0,
      materialId: formValue.materialId,
      itemQuantity: formValue.itemQuantity,
      itemRate: formValue.itemRate,
      expectedDate: formValue.expectedDate,
      material: material,
    };

    if (this.editingLineIndex !== null) {
      // Update existing line
      this.orderLines[this.editingLineIndex] = newLine;
      this.editingLineIndex = null;
    } else {
      // Add new line
      this.orderLines.push(newLine);
    }

    this.updateTotalValue();
    this.resetMaterialForm();
  }

  removeMaterialLine(index: number): void {
    this.orderLines.splice(index, 1);
    this.updateTotalValue();
    if (this.editingLineIndex === index) {
      this.resetMaterialForm();
    }
  }

  startUpdateMaterialLine(index: number): void {
    const line : any = this.orderLines[index];
    this.editingLineIndex = index;
    console.log(line);
    const material = this.materials.find((m) => m.id === parseInt(line.materialId));
    console.log(material);
    this.selectedMaterial = material || null;
    // Set the material first to trigger the change listener
    this.materialLineForm.patchValue({
      materialId: line.materialId,
    });

    // Then patch the rest of the values
    this.materialLineForm.patchValue({
      itemQuantity: line.itemQuantity,
      itemRate: line.itemRate,
      expectedDate: line.expectedDate,
    });
  }

  private resetMaterialForm(): void {
    this.materialLineForm.reset({
      expectedDate: new Date().toISOString().split('T')[0],
    });
    this.editingLineIndex = null;
    this.selectedMaterial = null;
  }

  private updateTotalValue(): void {
    this.totalOrderValue = this.orderLines.reduce(
      (sum, line) => sum + line.itemQuantity * line.itemRate,
      0
    );
    this.orderHeaderForm.patchValue({ orderValue: this.totalOrderValue });
  }

  onSubmit(): void {
    if (this.orderHeaderForm.invalid || this.orderLines.length === 0) {
      if (this.orderHeaderForm.invalid) {
        Object.keys(this.orderControls).forEach((key) => {
          const control = this.orderControls[key];
          if (control.invalid) {
            control.markAsTouched();
          }
        });
      }
      alert(
        'Please fill in all required fields and add at least one material line.'
      );
      return;
    }

    this.isSubmitting = true;
    const orderData = {
      ...this.orderHeaderForm.getRawValue(),
      orderValue: this.totalOrderValue,
      purchaseOrderDetails: this.orderLines,
    };

    this.purchaseOrderService.createPurchaseOrder(orderData).subscribe({
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
