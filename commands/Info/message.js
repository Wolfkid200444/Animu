const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['message-info', 'messageinfo', 'msginfo', 'msg'],
      requiredPermissions: ['EMBED_LINKS'],
      description: 'Get information about a message',
      cooldown: 10,
      usage: '<message:message>',
    });
  }

  async run(msg, [message]) {
    const format =
      message.author.avatar && message.author.avatar.startsWith('a_')
        ? 'gif'
        : 'png';
    const embed = new MessageEmbed()
      .setColor(message.member ? message.member.displayHexColor : 0x00ae86)
      .setThumbnail(message.author.displayAvatarURL({ format }))
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ format }),
      )
      .setDescription(message.content)
      .setTimestamp(message.createdAt)
      .setFooter(`ID: ${message.id}`)
      .addField('❯ Jump', message.url);
    return msg.send(embed);
  }
***REMOVED***
