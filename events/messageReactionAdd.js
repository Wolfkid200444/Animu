const { Event } = require('klasa');
const mongoose = require('mongoose');

//Init
const SelfRole = mongoose.model('SelfRole');

module.exports = class extends Event {
  async run(messageReaction, user) {
    if (messageReaction.message.partial) await messageReaction.message.fetch();

    //If guild isn't valid
    if (!require('../data/validGuilds').has(messageReaction.message.guild.id))
      return;

    const selfRole = await SelfRole.findOne({
      messageID: messageReaction.message.id,
      $or: [
        { emojiName: messageReaction._emoji.name },
        {
          emojiName: `${'<:' +
            messageReaction._emoji.name +
            ':' +
            messageReaction._emoji.id +
            '>'}`,
        },
      ],
    }).exec();

    if (selfRole) {
      const guild = this.client.guilds.get(selfRole.guildID);
      const role = guild.roles.find((r) => r.name === selfRole.roleName);
      const member = guild.members.get(user.id);

      //Assign Role
      member.roles.add(role);
    }
  }
***REMOVED***
