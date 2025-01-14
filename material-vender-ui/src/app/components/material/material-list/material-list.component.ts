import { Component, OnInit } from '@angular/core';
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
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private materialService:MaterialService) { }
  
  ngOnInit(): void {
    this.fetchMaterials();
  }

  fetchMaterials(): void {
    this.materialService.getMaterials().subscribe(result => {
      this.materials = result;
      this.totalPages = Math.ceil(this.materials.length / this.itemsPerPage);
      this.updatePaginatedMaterials();
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

  createMaterial(): void {
    alert('Navigate to the Create Material Page'); // Replace with routing logic
  }

  updateMaterial(materialId: number): void {
    alert(`Navigate to Update Material Page for Material ID: ${materialId}`); // Replace with routing logic
  }

  deleteMaterial(materialId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this material?');
    if (confirmDelete) {
      this.materials = this.materials.filter((material) => material.id !== materialId);
      this.totalPages = Math.ceil(this.materials.length / this.itemsPerPage);
      this.currentPage = Math.min(this.currentPage, this.totalPages); // Adjust current page
      this.updatePaginatedMaterials();
    }
  }
}
