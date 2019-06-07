//Dependencies
const mongoose = require('mongoose');
const _ = require('lodash');

//Init
const Profile = mongoose.model('Profile');

module.exports = client => {
  client.on('guildMemberAdd', async member => {
    const aldovia = client.guilds.get('556442896719544320');
    const memberLeavesChannel = aldovia.channels.get('586644004536582145');

    //Store roles in profile
    const profile = await Profile.findOne({ memberID: member.id }).exec();

    if (profile) {
      member.roles.forEach(role => {
        profile.roles.push(role.name);
      });
      await profile.save();
    }

    memberLeavesChannel.send(`${member.displayName} has left alvonia`);
  });
***REMOVED***
