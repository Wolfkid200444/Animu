const { Task } = require('klasa');
const mongoose = require('mongoose');

//Init
const Key = mongoose.model('Key');
const Guild = mongoose.model('Guild');

module.exports = class extends Task {
  async run() {
    const keys = await Key.find({}).exec();

    keys.forEach(async (key) => {
      if (key.daysLeft > 0) key.daysLeft--;

      if (key.daysLeft === 0) {
        const guild = await Guild.findOne({ key: key.key }).exec();
        if (guild) require('../data/validGuilds').remove(guild.guildID);
      }
      await key.save();
    });
  }
***REMOVED***
