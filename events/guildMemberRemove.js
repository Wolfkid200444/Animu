//Dependencies
const mongoose = require('mongoose');
const _ = require('lodash');

//Init
const Profile = mongoose.model('Profile');

module.exports = client => {
  client.on('guildMemberRemove', async member => {
    //Store roles in profile
    const profile = await Profile.findOne({ memberID: member.id }).exec();

    if (profile) {
      member.roles.forEach(role => {
        profile.roles.push(role.name);
      });
      await profile.save();
    }
  });
***REMOVED***
