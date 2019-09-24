//Dependencies
const { Event } = require('klasa');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');

module.exports = class extends Event {
  async run(member) {
    //Register Profile
    const profile = await Profile.register(member.id);

    if (profile.res === 'already_exists') {
      const profileFind = await Profile.findOne({ memberID: member.id }).exec();

      profileFind.reputation.push({
        guildID: member.guild.id,
        rep: 50,
      });

      await profileFind.save();
    }

    if (
      profile.res === 'already_exists' &&
      member.guild.settings.mutedRole &&
      profile.isMuted
    )
      member.roles.add(member.guild.settings.mutedRole, 'Assigning Muted role');
    else if (member.guild.settings.joinRole)
      member.roles.add(member.guild.settings.joinRole, 'Assigning Member role');
  }
***REMOVED***
