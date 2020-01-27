// Dependencies
import { Document } from 'mongoose';

// Interfaces
export interface IITemDocument extends Document {
  name: string;
  description: string;
  imageURL: string;
  price: number;
  discount: number;
  usable: boolean;
  instantUse: boolean;
  inShop: boolean;
  purchaseMsg: string;
  properties: Array<string | number>;
}
