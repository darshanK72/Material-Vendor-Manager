import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Material } from 'src/app/models/material.model';
import { MaterialService } from 'src/app/services/material.service';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css'],
})
export class MaterialListComponent implements OnInit {
  materials: Material[] = [];
  paginatedMaterials: Material[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private materialService:MaterialService,private router:Router) { }
  
  ngOnInit(): void {
    this.fetchMaterials();
  }

  fetchMaterials(): void {
    this.materialService.getMaterials().subscribe(result => {
      this.materials = result;
      this.totalPages = Math.ceil(this.materials.length / this.itemsPerPage);
      this.updatePaginatedMaterials();
      this.isLoading = false;
    })
  }

  updatePaginatedMaterials(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMaterials = this.materials.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedMaterials();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedMaterials();
    }
  }

  updateMaterial(materialId: number): void {
    this.router.navigate(['/materials/update', materialId]);
  }

  deleteMaterial(materialId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this material?');
    if (confirmDelete) {
      this.materialService.deleteMaterial(materialId).subscribe({
        next : (result) => {
          this.fetchMaterials();
      },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }
}
