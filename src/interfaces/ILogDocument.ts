// Dependencies
import { Document } from 'mongoose';

// Interfaces
export interface ILogDocument extends Document {
  guildID: string;
  event: string;
  dateTime: Date;
  data: any;
  expire_at: Date;
}
