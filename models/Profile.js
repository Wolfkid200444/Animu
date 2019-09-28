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
  level: [
    {
      guildID: String,
      exp: Number,
      level: Number,
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
  this.reputation[index].rep -= amount;

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

profileSchema.methods.addExp = async function(expToAdd, guildID) {
  const index = this.level.findIndex(
    (guildLev) => guildLev.guildID === guildID,
  );

  if (index < 0) return true;

  if (this.level[index].level === 100) return true;

  const levelUp = async (exp) => {
    this.level[index].level++;
    const expLeft =
      exp - expToNextLevel(this.level[index].level - 1, this.level[index].exp);
    if (
      expLeft >= expToNextLevel(this.level[index].level, this.level[index].exp)
    )
      levelUp(expLeft);
    else this.level[index].exp = expLeft;
  ***REMOVED***

  if (
    this.level[index].exp + expToAdd >=
    expToNextLevel(this.level[index].level, this.level[index].exp)
  )
    levelUp(expToAdd + this.level[index].exp);
  else this.level[index].exp += expToAdd;

  await this.save();
  return true;
***REMOVED***

//Helper Functions
function expToNextLevel(currentLevel, currentExp) {
  return 10 * (currentLevel + 1) ** 2 - currentExp;
}

//Model
model('Profile', profileSchema);
