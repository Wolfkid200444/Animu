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
      description: 'Yeet a self role',
      usage: '<roleName:string>',
    });
  }

  async run(msg, [roleName]) {
    const selfRole = await SelfRole.findOne({
      guildID: msg.guild.id,
      roleName,
    }).exec();

    if (!selfRole)
      return msg.sendMessage(
        new MessageEmbed({
          title: 'Self Role not found',
          description: 'No self role with provided role was found',
          color: '#f44336',
        })
      );

    await SelfRole.remove({ guildID: msg.guild.id, roleName }).exec();

    return msg.sendMessage(
      new MessageEmbed({
        title: 'Deleted Self Role',
        description: 'Deleted Self role successfully',
        color: '#2196f3',
      })
    );
  }
***REMOVED***
