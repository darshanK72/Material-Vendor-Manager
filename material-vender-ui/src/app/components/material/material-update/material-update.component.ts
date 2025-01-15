import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from 'src/app/services/material.service';

@Component({
  selector: 'app-material-update',
  templateUrl: './material-update.component.html',
  styleUrls: ['./material-update.component.css'],
})
export class MaterialUpdateComponent {
  materialUpdateForm!: FormGroup;
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  materialId: number = 0;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.materialId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.initializeForm();
    this.loadMaterial();
  }

  private initializeForm(): void {
    this.materialUpdateForm = this.fb.group({
      id: [0],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      shortText: ['', [Validators.required, Validators.maxLength(100)]],
      longText: ['', Validators.maxLength(500)],
      unit: ['', [Validators.required, Validators.maxLength(20)]],
      reorderLevel: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      minOrderQuantity: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      isActive: [true, Validators.required],
    });
  }

  private loadMaterial(): void {
    if (this.materialId <= 0) {
      this.router.navigate(['/materials']);
      return;
    }

    this.materialService.getMaterialById(this.materialId).subscribe({
      next: (material) => {
        this.materialUpdateForm.patchValue({
          id: material.id,
          code: material.code,
          shortText: material.shortText,
          longText: material.longText,
          unit: material.unit,
          reorderLevel: material.reorderLevel,
          minOrderQuantity: material.minOrderQuantity,
          isActive: material.isActive,
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading material:', error);
        alert('Failed to load material details. Please try again.');
        this.router.navigate(['/materials']);
      },
    });
  }

  get formControls() {
    return this.materialUpdateForm.controls;
  }

  onSubmit(): void {
    if (this.materialUpdateForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const material = this.materialUpdateForm.value;

    this.materialService.updateMaterial(this.materialId, material).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Material updated successfully!');
        this.router.navigate(['/materials']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating material:', error);
        alert('Failed to update material. Please try again.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/materials']);
  }
}
