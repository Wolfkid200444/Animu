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
      description: 'Add a new self role',
      usage: '<emojiName:string> <roleName:string>',
      usageDelim: ' '
    });
  }

  async run(msg, [emojiName, roleName]) {
    const emoji = this.client.emojis.find(e => e.name === emojiName);
    const role = msg.guild.roles.find(r => r.name === roleName);

    if (
      !msg.guild.settings.selfRoleChannel ||
      !msg.guild.settings.selfRoleMessage
    )
      return msg.sendMessage(
        new MessageEmbed({
          title: 'No self role channel/msg found',
          description:
            'The self role channel/msg is not configured, please configure it using `conf` command',
          color: '#f44336'
        })
      );

    if (!emoji || !role)
      return msg.sendMessage(
        new MessageEmbed({
          title: 'No Emoji/role found',
          description: 'The emoji/role name that you provided is/are invalid',
          color: '#f44336'
        })
      );

    await new SelfRole({
      guildID: msg.guild.id,
      channelID: msg.guild.settings.selfRoleChannel,
      messageID: msg.guild.settings.selfRoleMessage,
      emojiName: emojiName,
      roleName: roleName
    }).save();
  }
***REMOVED***
