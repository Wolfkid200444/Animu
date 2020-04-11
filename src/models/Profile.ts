// Dependencies
import { Schema, model, Model } from 'mongoose';
import { IProfileDocument } from '../interfaces/IProfileDocument';
import _ from 'lodash';

// Interfaces
export interface IProfile extends IProfileDocument {
  addReputation(reputation: number, guildID: string): Promise<boolean>;
  deductReputation(reputation: number, guildID: string): Promise<boolean>;
  edit(field: string, value: string): Promise<IProfile>;
  addExp(
    expToAdd: number,
    guildID: string,
    defaultRep: number
  ): Promise<number[]>;
}

export interface IProfileModel extends Model<IProfile> {
  register(memberID: string): Promise<{ res: string; profile: IProfile }>;
}

// Schema
export const profileSchema: Schema<IProfile> = new Schema({
  memberID: {
    type: String,
    unique: true,
  },
  description: String,
  favoriteAnime: String,
  profileColor: String,
  profileWallpaper: String, // url
  badges: [
    {
      guildID: String,
      activeBadge: String,
      badges: [String],
    },
  ],
  marriedTo: String,
  mutedIn: [String],
  reputation: [
    {
      guildID: String,
      rep: {
        min: 0,
        type: Number,
      },
    },
  ],
  level: [
    {
      guildID: String,
      exp: Number,
      level: Number,
    },
  ],
});

// Static Methods
profileSchema.statics.register = async function (memberID: string) {
  const profile = await this.findOne({ memberID }).exec();

  if (profile) return { res: 'already_exists', profile };
  const Inventory = this.model('Inventory');

  await new Inventory({
    memberID,
    coins: 0,
    inventory: [],
  }).save();

  return {
    res: 'created',
    profile: await new this({
      memberID,
      description: '[No description provided]',
      favoriteAnime: '[No favorite anime provided]',
      profileColor: '#2196f3',
      mutedIn: [],
      badges: [],
      marriedTo: '',
      reputation: [],
    }).save(),
  };
};

// Methods
profileSchema.methods.addReputation = async function (amount, guildID) {
  const index = this.reputation.findIndex((rep) => rep.guildID === guildID);
  this.reputation[index].rep += amount;

  this.save();
  return true;
};

profileSchema.methods.deductReputation = async function (amount, guildID) {
  const index = this.reputation.findIndex((rep) => rep.guildID === guildID);
  this.reputation[index].rep -= amount;

  if (this.reputation <= 0) {
    this.reputation = 20;

    this.save();

    return false;
  }

  this.save();
  return true;
};

profileSchema.methods.edit = async function (field, value) {
  this[field] = value;

  await this.save();

  return this;
};

profileSchema.methods.addExp = async function (
  expToAdd,
  guildID,
  defaultRep = 50
): Promise<number[]> {
  let index = this.level.findIndex((guildLev) => guildLev.guildID === guildID);
  let levelUps = [];

  if (index < 0) {
    if (!this.reputation.find((rep) => rep.guildID === guildID))
      this.reputation.push({
        guildID: guildID,
        rep: defaultRep,
      });

    if (!this.level.find((level) => level.guildID === guildID))
      this.level.push({
        guildID: guildID,
        level: 1,
        exp: 10,
      });

    index = this.level.findIndex((guildLev) => guildLev.guildID === guildID);
  }

  if (this.level[index].level === 100) return [];

  // Storing current level
  const currentLevel = this.level[index].level;

  // Adding exp
  this.level[index].exp += expToAdd;

  // Get new level
  this.level[index].level = getCurrentLevel(this.level[index].exp);

  // Get range   of levelled up levels
  const range = this.level[index].level - currentLevel;

  // Generate Array of levelled up levels
  if (range) levelUps = _.range(currentLevel + 1, this.level[index].level + 1);

  await this.save();
  return levelUps;
};

// Helper Functions
function getCurrentLevel(currentExp: number) {
  return Math.floor(Math.pow(currentExp / 10, 1 / 2.5));
}

// Model & Exporting
export const Profile: IProfileModel = model<IProfile, IProfileModel>(
  'Profile',
  profileSchema
);
