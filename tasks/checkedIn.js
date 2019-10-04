const { Task } = require('klasa');
const mongoose = require('mongoose');

//Init
const Inventory = mongoose.model('Inventory');

module.exports = class extends Task {
  async run() {
    const inventories = await Inventory.find({}).exec();

    inventories.forEach(async (inventory) => {
      inventory.checkedIn = false;
      await inventory.save();
    });
  }
***REMOVED***
