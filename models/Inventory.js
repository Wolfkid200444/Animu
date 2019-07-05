const { Schema, model } = require('mongoose');

const inventorySchema = new Schema({
  memberID: {
    type: String,
    unique: true
  },
  coins: Number,
  inventory: [String],
  lottos: [Number]
});

inventorySchema.methods.addCoins = async function(amount) {
  this.coins += amount;

  this.save();
  return true;
***REMOVED***

inventorySchema.methods.deductCoins = async function(amount) {
  this.coins -= amount;

  this.save();
  return true;
***REMOVED***

model('Inventory', inventorySchema);
