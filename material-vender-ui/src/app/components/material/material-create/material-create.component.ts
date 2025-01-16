import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/services/material.service';

@Component({
  selector: 'app-material-create',
  templateUrl: './material-create.component.html',
  styleUrls: ['./material-create.component.css'],
})
export class MaterialCreateComponent implements OnInit {
  materialForm!: FormGroup;
  isSubmitting: boolean = false;
  nextMaterialCode: any = 'MAT001';

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.materialService.getNextMaterialCode().subscribe((result) => {
      this.nextMaterialCode = result.code;
      this.materialForm.patchValue({
        code:this.nextMaterialCode
      })
    });
  }

  private initializeForm(): void {
    this.materialForm = this.fb.group({
      code: [
        '',
        [Validators.required, Validators.maxLength(50)],
      ],
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

    this.materialForm.get('code')?.disable();
  }

  get formControls() {
    return this.materialForm.controls;
  }

  onSubmit(): void {
    if (this.materialForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const material = this.materialForm.value;

    this.materialService.createMaterial(material).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Material created successfully!');
        this.router.navigate(['/materials']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating material:', error);
        alert('Failed to create material. Please try again.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/materials']);
  }
}
