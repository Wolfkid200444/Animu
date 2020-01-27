import { Document } from 'mongoose';

// Interfaces
export interface IPetDocument extends Document {
  memberID: string;
  petType: string;
  petName: string;
  age: number;
  personality: 0 | 1 | 2 | 3 | 4;
  happiness: number;
  happinessCap: number;
  hunger: number;
  petUnhappyForHours: number;
  toys: string[];
}
