const { Event } = require('klasa');
const mongoose = require('mongoose');

//Init
const SelfRole = mongoose.model('SelfRole');

module.exports = class extends Event {
  async run(messageReaction, user) {
    const selfRole = await SelfRole.findOne({
      messageID: messageReaction.message.id,
      $or: [
        { emojiName: messageReaction._emoji.name },
        {
          emojiName: `${'<:' +
            messageReaction._emoji.name +
            ':' +
            messageReaction._emoji.id +
            '>'}`
        }
      ]
    }).exec();

    if (selfRole) {
      const guild = this.client.guilds.get(selfRole.guildID);
      const role = guild.roles.find(r => r.name === selfRole.roleName);
      const member = guild.members.get(user.id);

      //Remove Role
      member.roles.remove(role);
    }
  }
***REMOVED***
