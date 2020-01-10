//Dependencies
const { Schema, model } = require('mongoose');

/**
 * Pet Personality
 * ================
 * Pet personality affects how fast they get unhappy, and how longer they can stay unfed
 *
 * Types
 * ------
 * 0 - 40-50% less endurability
 * 1 - 30-40% less endurability
 * 2 - 20-30% less endurability
 * 3 - 10-20% less endurability
 * 4 - 5-10% less endurability
 * 5 - Normal
 * 6 - 5-10% more endurability
 * 7 - 10-20% more endurability
 * 8 - 20-30% more endurability
 * 9 - 30-40% more endurability
 * 10 - 40-50% more endurability
 */

//Schema
const petSchema = new Schema({
  memberID: {
    type: String,
    unique: true,
  },
  petType: String,
  petName: String,
  personality: {
    type: Number,
    min: 0,
    max: 10,
  },
  happiness: {
    type: Number,
    min: 0,
    max: 100,
  }, // 1 - 100, If below x (depends upon personality) for 7 days, pet run aways | If x (depends upon personality), pet runs away instantly
  happinessCap: {
    type: Number,
    min: 30,
    max: 100,
    default: 100,
  }, // Cap for happiness, will decrease when pet is unfed
  lastFedHoursAgo: {
    type: Number,
    default: 0,
  }, // If surpasses x (depends upon personality), your pet dies
  petUnhappyForDays: {
    type: Number,
    default: 0,
  }, // If x (depends upon personality), pet runs away
});

// Schema Methods
petSchema.methods.notFedInHour = function() {
  this.lastFedHoursAgo += 1;

  this.save();
  return this.lastFedHoursAgo;
***REMOVED***

//Model
model('Pet', petSchema);
