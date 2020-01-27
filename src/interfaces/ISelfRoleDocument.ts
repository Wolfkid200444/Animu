// Dependencies
import { Document } from 'mongoose';

// Interfaces
export interface ISelfRoleDocument extends Document {
  guildID: string;
  messageID: string;
  emojiName: string;
  roleName: string;
}
