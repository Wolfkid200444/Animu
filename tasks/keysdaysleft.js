const { Task } = require('klasa');
const mongoose = require('mongoose');

//Init
const Key = mongoose.model('Key');

module.exports = class extends Task {
  async run() {
    const keys = await Key.find({}).exec();

    keys.forEach(async (key) => {
      if (!key.daysLeft > 0) key.daysLeft--;
      await key.save();
    });
  }
***REMOVED***
