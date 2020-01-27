import { Document } from 'mongoose';

// Interface
export interface ILevelPerk {
  level: number;
  badge?: string;
  role?: string;
  rep?: number;
}

export interface IGuildDocument extends Document {
  guildID: string;
  tier: 'free' | 'lite' | 'plus' | 'pro';
  premiumDaysLeft: number;
  levelPerks: Array<ILevelPerk>;
}
