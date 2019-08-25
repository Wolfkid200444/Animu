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
      usage: '<emoji:string> <roleName:...string>',
      usageDelim: ' ',
      quotedStringSupport: true
    });
  }

  async run(msg, [emoji, roleName]) {
    const role = msg.guild.roles.find(r => r.name === roleName);
    if (this.client.emojis.find(e => e.name === emoji.split(':')[1]))
      emoji = this.client.emojis.find(e => e.name === emoji.split(':')[1]);

    if (
      !msg.guild.settings.selfRolesChannel ||
      !msg.guild.settings.selfRolesMessage
    )
      return msg.sendMessage(
        new MessageEmbed({
          title: 'No self role channel/msg found',
          description:
            'The self role channel/msg is not configured, please configure it using `conf` command',
          color: '#f44336'
        })
      );

    if (!role)
      return msg.sendMessage(
        new MessageEmbed({
          title: 'No Emoji/role found',
          description: 'The emoji/role name that you provided is/are invalid',
          color: '#f44336'
        })
      );

    const rCh = msg.guild.channels.get(msg.guild.settings.selfRolesChannel);

    const rMsg = await rCh.messages.fetch(msg.guild.settings.selfRolesMessage);

    if (!rMsg || !rCh)
      return msg.sendMessage(
        new MessageEmbed({
          title: 'Invalid self role channel/msg',
          description:
            'The self role channel/msg that you provided is/are invalid',
          color: '#f44336'
        })
      );

    rMsg.react(emoji);

    await new SelfRole({
      guildID: msg.guild.id,
      messageID: msg.guild.settings.selfRolesMessage,
      emojiName: emoji,
      roleName: roleName
    }).save();

    return msg.sendMessage(
      new MessageEmbed({
        title: 'Self Role Added',
        description: 'Self role is successfully added',
        color: '#2196f3'
      })
    );
  }
***REMOVED***
