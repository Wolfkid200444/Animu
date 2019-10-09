//Dependencies
const { Schema, model } = require('mongoose');

//Schema
const petSchema = new Schema({
  memberID: {
    type: String,
    unique: true,
  },
  petType: String,
  petName: String,
  happiness: {
    type: Number,
    default: 100,
  }, //1 - 100, If below 50 for 7 days, pet run aways
  lastFedHoursAgo: {
    type: Number,
    default: 0,
  }, //If surpasses 24, your pet dies
  petUnhappyForDays: {
    type: Number,
    default: 0,
  }, //If 7, pet runs away
});

//Schema Methods
petSchema.methods.notFedInHour = function() {
  this.lastFedHoursAgo += 1;

  this.save();
  return this.lastFedHoursAgo;
***REMOVED***

//Model
model('Pet', petSchema);
