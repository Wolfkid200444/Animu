// Dependencies
import { Document } from 'mongoose';

// InterfacesmemberID:
export interface IInventoryDocument extends Document {
  memberID: string;
  coins: number;
  inventory: string[];
  checkedIn: boolean;
}
