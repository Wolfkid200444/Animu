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
  age: {
    type: Number,
    default: Math.round(Math.random() * 100) + 10,
  }, // Pets are highly likely to die as they approach 600 days
  personality: {
    type: Number,
    min: 0,
    max: 4,
    default: Math.round(Math.random() * 4),
  },
  happiness: {
    type: Number,
    min: 0,
    max: 100,
    default: 80,
  }, // 1 - 100, If below x (depends upon personality) for 7 days, pet run aways | If x (depends upon personality), pet runs away instantly
  happinessCap: {
    type: Number,
    min: 30,
    max: 100,
    default: 100,
  }, // Cap for happiness, will decrease when pet is unfed
  hunger: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  }, // If surpasses 100, your pet dies
  petUnhappyForHours: {
    type: Number,
    default: 0,
  }, // If x (depends upon personality), pet runs away
  toys: [String], // Toys will affect rate at which happiness drops/increases
});

// Schema Methods
petSchema.methods.petAge = async function() {
  this.age += 1;

  await this.save();
  return this.age;
***REMOVED***

petSchema.methods.notFedInHour = async function() {
  this.hunger +=
    this.personality === 1 || this.personality === 3
      ? 3
      : this.personality === 2 || this.personality === 4
      ? 5
      : 4;

  await this.save();
  return this.hunger;
***REMOVED***

petSchema.methods.notPlayedInHour = async function() {
  const Item = this.model('Item');
  const toys = await Item.find({ itemName: { $in: this.toys } });

  console.log(toys);

  let happinessToDeduct =
    this.personality === 2 || this.personality === 3
      ? 4
      : this.personality === 1 || this.personality === 4
      ? 6
      : 5;

  toys.forEach(t => {
    if (t.properties[2] === 'unhappiness_rate_decrease')
      happinessToDeduct -= t.properties[3];
  });

  this.happiness -= happinessToDeduct >= 1 ? happinessToDeduct : 1;

  if (this.happiness >= this.happinessCap) this.happiness = this.happinessCap;

  await this.save();
  return this.happiness;
***REMOVED***

petSchema.methods.petFed = async function() {
  this.hunger -=
    this.personality === 1 || this.personality === 3
      ? 40
      : this.personality === 2 || this.personality === 4
      ? 20
      : 30;

  const hungerEndurability =
    this.personality === 1 || this.personality === 3
      ? 70
      : this.personality === 2 || this.personality === 4
      ? 40
      : 50;

  if (this.hunger >= hungerEndurability) this.happinessCap = 100;

  await this.save();
  return this.hunger;
***REMOVED***

petSchema.methods.petHappy = async function(rate) {
  const Item = this.model('Item');
  const toys = await Item.find({ itemName: { $in: this.toys } });

  let happinessToAdd =
    this.personality === 2 || this.personality === 3
      ? rate * 1.5
      : this.personality === 1 || this.personality === 4
      ? rate * 0.5
      : rate;

  if (toys.length > 0)
    toys.forEach(t => {
      if (t.properties[2] === 'happiness_increase')
        happinessToAdd += t.properties[3];
    });

  this.happiness += happinessToAdd;

  if (this.happiness <= this.happinessCap) this.happiness = this.happinessCap;

  await this.save();
  return this.happiness;
***REMOVED***

petSchema.methods.giveToy = async function(toyName) {
  if (this.personality === 4 && Math.random() * 100 < 33) return false;

  this.toys.push(toyName);

  await this.save();
  return this.toys;
***REMOVED***

//Model
model('Pet', petSchema);
