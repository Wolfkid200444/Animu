//Dependencies
const { Schema, model } = require('mongoose');

//Schema
const profileSchema = new Schema({
  memberID: {
    type: String,
    unique: true
  },
  description: String,
  favoriteAnime: String,
  profileColor: String,
  activeBadge: String,
  badges: [String],
  marriedTo: String,
  rewards: {
    silver: Number,
    gold: Number,
    platinum: Number
  },
  reputation: {
    min: 0,
    max: 100,
    type: Number
  },
  previousRoles: []
});

//Schema Methods
profileSchema.statics.register = async function(memberID) {
  const profile = await this.findOne({ memberID }).exec();

  if (profile) return { res: 'already_exists', profile ***REMOVED***
  const Inventory = this.model('Inventory');

  await new Inventory({
    memberID,
    coins: 100,
    inventory: []
  }).save();

  return {
    res: 'created',
    profile: await new this({
      memberID,
      description: '[No description provided]',
      favoriteAnime: '[No favorite anime provided]',
      profileColor: '#2196f3',
      activeBadge: '',
      badges: [],
      marriedTo: '',
      rewards: { silver: 0, gold: 0, platinum: 0 },
      reputation: 50,
      previousRoles: []
    }).save()
  ***REMOVED***
***REMOVED***

profileSchema.methods.edit = async function(memberID, field, value) {
  this[field] = value;

  await this.save();

  return this;
***REMOVED***

//Model
model('Profile', profileSchema);
