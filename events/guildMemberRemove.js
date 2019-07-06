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

    if (profile) {
      const index = profile.previousRoles.indexOf(
        roles => roles.guildID === member.guild.id
      );

      if (index >= 0)
        member.roles.forEach(role => {
          profile.previousRoles[index].roles.push(role.name);
        });
      else
        profile.previousRoles.push({
          guildID: member.guild.id,
          roles: _.map(member.roles, role => role.name)
        });

      await profile.save();
    }
  }
***REMOVED***
