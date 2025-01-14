export interface Material {
  id?: number;
  code: string;
  shortText: string;
  longText: string;
  unit: string;
  reorderLevel: number;
  minOrderQuantity: number;
  isActive: boolean;
}