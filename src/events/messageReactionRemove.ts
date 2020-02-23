import { Event, KlasaUser } from 'klasa';
import mongoose from 'mongoose';
import { ISelfRoleModel } from '../models/SelfRole';
import { MessageReaction } from 'discord.js';

//Init
const SelfRole = <ISelfRoleModel>mongoose.model('SelfRole');

module.exports = class extends Event {
  async run(messageReaction: MessageReaction, user: KlasaUser) {
    if (user.bot) return;

    const selfRole = await SelfRole.findOne({
      messageID: messageReaction.message.id,
      $or: [
        { emojiName: messageReaction.emoji.name },
        {
          emojiName: `${'<:' +
            messageReaction.emoji.name +
            ':' +
            messageReaction.emoji.id +
            '>'}`,
        },
      ],
    }).exec();

    if (selfRole) {
      const guild = this.client.guilds.get(selfRole.guildID);
      const role = guild.roles.find(r => r.name === selfRole.roleName);
      const member = guild.members.get(user.id);

      //Remove Role
      member.roles.remove(role);
    }
  }
};
