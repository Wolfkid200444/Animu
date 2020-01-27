// Dependencies
import { Schema, model, Model } from 'mongoose';
import { ILogDocument } from '../interfaces/ILogDocument';

// Interfaces
export interface ILog extends ILogDocument {}

export interface ILogModel extends Model<ILog> {}

const logSchema: Schema<ILog> = new Schema({
  guildID: String,
  event: String,
  dateTime: {
    type: Date,
    default: Date.now,
  },
  data: Schema.Types.Mixed,
  expire_at: { type: Date, default: Date.now(), expires: 60 * 60 * 24 * 30 },
});

export const Log: ILogModel = model<ILog, ILogModel>('Log', logSchema);
