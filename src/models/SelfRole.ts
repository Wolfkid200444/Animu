// Dependencies
import { Schema, model, Model } from 'mongoose';
import { ISelfRoleDocument } from '../interfaces/ISelfRoleDocument';

// Interfaces
export interface ISelfRole extends ISelfRoleDocument {}

export interface ISelfRoleModel extends Model<ISelfRole> {}

// Schema
const selfRoleSchema = new Schema({
  guildID: String,
  messageID: String,
  emojiName: String,
  roleName: String,
});

// Exporting
export const SelfRole: ISelfRoleModel = model<ISelfRole, ISelfRoleModel>(
  'SelfRole',
  selfRoleSchema
);
