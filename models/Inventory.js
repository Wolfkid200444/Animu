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

model('Inventory', inventorySchema);
