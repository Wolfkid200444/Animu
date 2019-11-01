const { Task } = require('klasa');
const { botEnv } = require('../config/keys');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');

module.exports = class extends Task {
  async run() {
    if (!botEnv === 'production') return;

    const profiles = await Profile.find({}).exec();

    profiles.forEach(async (profile) => {
      if (!profile.lastBannerChange) return;

      profile.lastBannerChange.forEach((guild) => {
        guild.daysAgo++;
        if (guild.daysAgo === 30) {
          this.client.users
            .get(profile.memberID)
            .send(
              `You can change ${this.client.guilds.get(
                guild.guildID,
              )}'s Server Banner again!`,
            );
        }
      });

      await profile.save();
    });
  }
***REMOVED***
