import { Document } from 'mongoose';

// Interfaces
export interface INotificationDocument extends Document {
  guildID: string;
  title: string;
  dateTime: Date;
  description: string;
  type: string; // Eg: 'staff_left', 'companion_update', etc
  read: boolean;
}
