const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const SelfRole = mongoose.model('SelfRole');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 7,
      runIn: ['text'],
      requiredPermissions: ['MANAGE_ROLES', 'EMBED_LINKS'],
      description: 'View Self roles',
    });
  }

  async run(msg) {
    const selfRoles = await SelfRole.find({ guildID: msg.guild.id }).exec();

    return msg.sendMessage(
      new MessageEmbed({
        title: 'Self Roles',
        description: selfRoles
          .map(s => `• ${s.emojiName} - **${s.roleName}**`)
          .join('\n'),
        color: '#2196f3',
      })
    );
  }
***REMOVED***
