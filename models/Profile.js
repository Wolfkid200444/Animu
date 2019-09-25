//Dependencies
const { Schema, model } = require('mongoose');

//Schema
const profileSchema = new Schema({
  memberID: {
    type: String,
    unique: true,
  },
  description: String,
  favoriteAnime: String,
  profileColor: String,
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
  lastBannerChange: [
    {
      guildID: String,
      daysAgo: Number,
    },
  ],
});

//Schema Methods
profileSchema.statics.register = async function(memberID) {
  const profile = await this.findOne({ memberID }).exec();

  if (profile) return { res: 'already_exists', profile ***REMOVED***
  const Inventory = this.model('Inventory');

  await new Inventory({
    memberID,
    coins: 100,
    inventory: [],
  }).save();

  return {
    res: 'created',
    profile: await new this({
      memberID,
      description: '[No description provided]',
      favoriteAnime: '[No favorite anime provided]',
      profileColor: '#2196f3',
      badges: [],
      marriedTo: '',
      reputation: [],
      previousRoles: [],
    }).save(),
  ***REMOVED***
***REMOVED***

profileSchema.methods.addReputation = async function(amount, guildID) {
  const index = this.reputation.findIndex((rep) => rep.guildID === guildID);
  this.reputation[index].rep += amount;

  this.save();
  return true;
***REMOVED***

profileSchema.methods.deductReputation = async function(amount, guildID) {
  const index = this.reputation.findIndex((rep) => rep.guildID === guildID);
  this.reputation[index] -= amount;

  if (this.reputation <= 0) {
    this.reputation = 20;

    this.save();

    return false;
  }

  this.save();
  return true;
***REMOVED***

profileSchema.methods.edit = async function(field, value) {
  this[field] = value;

  await this.save();

  return this;
***REMOVED***

//Model
model('Profile', profileSchema);
