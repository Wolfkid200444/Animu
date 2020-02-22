import { INotificationDocument } from '../interfaces/INotificationDocument';
import { Model, Schema, model } from 'mongoose';

// Dependencies

// Interfaces
export interface INotification extends INotificationDocument {}
export interface INotificationModel extends Model<INotification> {}

// Schema
const notificationSchema = new Schema({
  guildID: String,
  title: String,
  dateTime: {
    type: Date,
    default: Date.now,
  },
  description: String,
  type: String,
  read: {
    type: Boolean,
    default: false,
  },
});

export const Notification: INotificationModel = model<
  INotification,
  INotificationModel
>('Notification', notificationSchema);
