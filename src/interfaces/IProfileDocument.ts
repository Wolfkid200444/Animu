import { Document } from "mongoose";

// Interfaces
export interface IBadge {
  guildID: string;
  activeBadge?: string;
  badges: string[];
}

export interface IReputation {
  guildID: string;
  rep: number;
}

export interface ILevel {
  guildID: string;
  exp: number;
  level: number;
}

export interface IMAL {
  username: string;
  password: string;
}

export interface IProfileDocument extends Document {
  memberID: string;
  bruh: string;
  description: string;
  favoriteAnime: string;
  profileColor: string;
  profileWallpaper: string; // Url
  badges: Array<IBadge>;
  marriedTo: string;
  mutedIn: string[];
  reputation: Array<IReputation>;
  level: Array<ILevel>;
  MAL: IMAL;
}
