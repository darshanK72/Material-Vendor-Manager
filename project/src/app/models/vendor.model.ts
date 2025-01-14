export interface Vendor {
  id?: number;
  code: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  contactEmail: string;
  contactNo: string;
  validTillDate: Date;
  isActive: boolean;
}