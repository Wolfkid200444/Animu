//Dependencies
const { Schema, model } = require('mongoose');

//Schema
const petSchema = new Schema({
  memberID: {
    type: String,
    unique: true
  },
  petType: String,
  petName: String
  //   happiness: Number, //1 - 100, If below 50 for 7 days, pet run aways
  //   lastFedHoursAgo: Number, //If surpasses 24, your pet dies
  //   petUnhappyForDays: Number //If 7, pet runs away
});

//Model
model('Pet', petSchema);
