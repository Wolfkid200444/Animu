//Dependencies
const { Event } = require('klasa');
const mongoose = require('mongoose');
const _ = require('lodash');

//Init
const Profile = mongoose.model('Profile');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      enabled: true,
      once: false
    });
  }

  async run(member) {
    //Store roles in profile
    const profile = await Profile.findOne({ memberID: member.id }).exec();

    if (
      profile &&
      member.guild.settings.mutedRole &&
      member.roles.find(r => r.id === member.guild.settings.mutedRole)
    ) {
      profile.isMuted = true;
      await profile.save();
    }
  }
***REMOVED***
