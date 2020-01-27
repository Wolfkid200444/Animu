// Dependencies
import { Document } from 'mongoose';

// Interfaces
export interface IDeposit {
  daysLeft: number;
  coins: number;
}

export interface IBankAccountDocument extends Document {
  memberID: string;
  deposits: Array<IDeposit>;
}
