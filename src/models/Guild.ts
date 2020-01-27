// Dependencies
import { Schema, model, Model } from 'mongoose';
import { IGuildDocument, ILevelPerk } from '../interfaces/IGuildDocument';

// Interfaces
export interface IGuild extends IGuildDocument {
  addLevelPerk(
    level: number,
    perkName: string,
    perkValue: string
  ): Promise<boolean>;
  removeLevelPerk(level: number): Promise<boolean>;
}

export interface IGuildModel extends Model<IGuild> {}

// Schema
const guildSchema: Schema<IGuild> = new Schema({
  guildID: String,
  tier: {
    type: String,
    enum: ['free', 'lite', 'plus', 'pro'],
  },
  premiumDaysLeft: {
    type: Number,
    default: 0,
  },
  levelPerks: [
    {
      level: Number,
      badge: String,
      role: String,
      rep: Number,
    },
  ],
});

guildSchema.methods.addLevelPerk = async function(level, perkName, perkValue) {
  const levelPerkIndex = this.levelPerks.findIndex(
    levelPerk => levelPerk.level === level
  );

  if (levelPerkIndex < 0) {
    // Level perks doesn't exist
    const perks: ILevelPerk = {
      level,
    ***REMOVED***

    if (perkName === 'badge') perks.badge = perkValue;
    if (perkName === 'role') perks.role = perkValue;
    if (perkName === 'rep') perks.rep = parseInt(perkValue);

    this.levelPerks.push(perks);
  } else {
    // Level perks exists
    const perks = this.levelPerks[levelPerkIndex];

    if (perkName === 'badge') perks.badge = perkValue;
    if (perkName === 'role') perks.role = perkValue;
    if (perkName === 'rep') perks.rep = parseInt(perkValue);

    this.levelPerks[levelPerkIndex] = perks;
  }

  await this.save();

  return true;
***REMOVED***

guildSchema.methods.removeLevelPerk = async function(level) {
  const levelPerkIndex = this.levelPerks.findIndex(
    levelPerk => levelPerk.level === level
  );

  if (levelPerkIndex < 0) return false;

  this.levelPerks.splice(levelPerkIndex, 1);

  await this.save();

  return true;
***REMOVED***

export const Guild: IGuildModel = model<IGuild, IGuildModel>(
  'Guild',
  guildSchema
);
