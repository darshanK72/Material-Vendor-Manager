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
  orderForm!: FormGroup;
  materialForm!: FormGroup;
  vendors: Vendor[] = [];
  materials: Material[] = [];
  orderLines: PurchaseOrderDetail[] = [];
  isSubmitting: boolean = false;
  totalOrderValue: number = 0;
  editingLineIndex: number | null = null;
  selectedMaterial: Material | null = null;
  nextOrderCode: string = "ORD0001";

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
    this.purchaseOrderService.getNextOrderCode().subscribe((result) => {
      this.nextOrderCode = result.code;
      this.orderForm.patchValue({
        orderNumber:this.nextOrderCode
      })
    });
  }

  private initializeForms(): void {
    this.orderForm = this.fb.group({
      orderNumber: [{value : 0,disabled : true}, [Validators.required]],
      orderDate: [new Date().toISOString().split('T')[0], Validators.required],
      vendorId: ['', Validators.required],
      notes: [''],
      orderValue: [{ value: 0, disabled: true }],
      orderStatus: ['Draft'],
    });

    this.materialForm = this.fb.group({
      id:[''],
      materialId: ['', Validators.required],
      itemNotes:[''],
      itemQuantity: [{ value: 0, disabled: false }, [Validators.required]],
      itemRate: [null, [Validators.required, Validators.min(0.01)]],
      expectedDate: [new Date().toISOString().split('T')[0]],
    });
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

  get orderControls() {
    return this.orderForm.controls;
  }

  get materialControls() {
    return this.materialForm.controls;
  }

  addMaterialLine(): void {

    console.log(this.materialForm);
    if (this.materialForm.invalid) {
      Object.keys(this.materialControls).forEach((key) => {
        const control = this.materialControls[key];
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const formValue = this.materialForm.value;
    console.log(formValue)
    const material = this.materials.find((m) => m.id === parseInt(formValue.materialId));
    console.log(material);
    if (!material) return;

    const newLine: PurchaseOrderDetail = {
      orderId: 0,
      materialId: formValue.materialId,
      itemQuantity: formValue.itemQuantity,
      itemRate: formValue.itemRate,
      expectedDate: formValue.expectedDate,
      material: material,
      code: material.code,
      unit: material.unit,
      shortText: material.shortText,
      itemNotes:formValue.itemNotes
    };

    if (this.editingLineIndex !== null) {
      this.orderLines[this.editingLineIndex] = newLine;
      this.editingLineIndex = null;
    } else {
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
    const material = this.materials.find((m) => m.id === parseInt(line.materialId));
    this.selectedMaterial = material || null;
    this.materialForm.patchValue({
      materialId: line.materialId,
    });

    this.materialForm.patchValue({
      itemQuantity: line.itemQuantity,
      itemRate: line.itemRate,
      expectedDate: line.expectedDate,
      itemNotes:line.itemNotes
    });
  }

  private resetMaterialForm(): void {
    this.materialForm.reset({
      expectedDate: new Date().toISOString().split('T')[0],
    });
    this.editingLineIndex = null;
    this.selectedMaterial = null;
  }

  onMaterialSelect(event: any) {
    let materialId = event.target.value;
    const material = this.materials.find((m) => m.id === parseInt(materialId));
    this.selectedMaterial = material || null;
    this.materialForm.patchValue({
      itemQuantity: material?.minOrderQuantity,
    });
    
  }
 
  private updateTotalValue(): void {
    this.totalOrderValue = this.orderLines.reduce(
      (sum, line) => sum + line.itemQuantity * line.itemRate,
      0
    );
    this.orderForm.patchValue({ orderValue: this.totalOrderValue });
  }
  
  onSubmit(): void {
    if (this.orderForm.invalid || this.orderLines.length === 0) {
      if (this.orderForm.invalid) {
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
      ...this.orderForm.getRawValue(),
      orderValue: this.totalOrderValue,
      purchaseOrderDetails: this.orderLines,
    };

    this.purchaseOrderService.createPurchaseOrder(orderData).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Purchase Order created successfully!');
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating purchase order:', error);
        alert('Failed to create purchase order. Please try again.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/orders']);
  }
}
