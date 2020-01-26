const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['channel-info', 'channelinfo', 'chinfo'],
      requiredPermissions: ['EMBED_LINKS'],
      description: 'Get information about a channel',
      cooldown: 10,
      usage: '[channel:channel]',
    });
    this.types = {
      dm: 'DM',
      group: 'Group DM',
      text: 'Text Channel',
      voice: 'Voice Channel',
      category: 'Category',
      unknown: 'Unknown',
    ***REMOVED***
  }

  async run(msg, [channel = msg.channel]) {
    const embed = new MessageEmbed()
      .setColor(0x2196f3)
      .addField(
        '❯ Name',
        channel.type === 'dm' ? `@${channel.recipient.username}` : channel.name,
        true,
      )
      .addField('❯ ID', channel.id, true)
      .addField('❯ NSFW', channel.nsfw ? 'Yes' : 'No', true)
      .addField(
        '❯ Category',
        channel.parent ? channel.parent.name : 'None',
        true,
      )
      .addField('❯ Type', this.types[channel.type], true)
      .addField(
        '❯ Creation Date',
        moment.utc(channel.createdAt).format('MM/DD/YYYY h:mm A'),
        true,
      )
      .addField('❯ Topic', channel.topic || 'None');

    return msg.send(embed);
  }
***REMOVED***
