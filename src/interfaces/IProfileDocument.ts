import { Document } from 'mongoose';

// Interface
export interface IProfileDocument extends Document {
  memberID: {
    type: String;
    unique: true;
  ***REMOVED***
  description: String;
  favoriteAnime: String;
  profileColor: String;
  profileWallpaper: String; // Url
  badges: [
    {
      guildID: String;
      activeBadge: String;
      badges: [String];
    }
  ];
  marriedTo: String;
  mutedIn: [String];
  reputation: [
    {
      guildID: String;
      rep: {
        min: 0;
        type: Number;
      ***REMOVED***
    }
  ];
  level: [
    {
      guildID: String;
      exp: Number;
      level: Number;
    }
  ];
}
