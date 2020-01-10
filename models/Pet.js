//Dependencies
const { Schema, model } = require('mongoose');

/**
 * Pet Personality
 * ================
 * Pet personality affects how fast they get unhappy, and how longer they can stay unfed
 *
 * Types
 * ------
 * 0 - Normal
 * 1 - Can stay hungry for longer but gets unhappy faster
 * 2 - Can stay happy for longer but gets hungry faster
 * 3 - Can stay happy/hungry for longer
 * 4 - Can't say happy/hungry for longer
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
    max: 4,
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
