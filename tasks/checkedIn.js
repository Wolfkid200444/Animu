const { Task } = require('klasa');
const { botEnv } = require('../config/keys');
const mongoose = require('mongoose');

//Init
const Inventory = mongoose.model('Inventory');

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    const inventories = await Inventory.find({}).exec();

    inventories.forEach(async inventory => {
      inventory.checkedIn = false;
      await inventory.save();
    });
  }
***REMOVED***
