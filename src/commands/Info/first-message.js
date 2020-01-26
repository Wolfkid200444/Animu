const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['firstmessage', 'firstmsg', 'first-msg'],
      requiredPermissions: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
      description: 'Get first message ever sent in a channel',
      cooldown: 10,
      usage: '[channel:channel]',
    });
  }

  async run(msg, [channel = msg.channel]) {
    if (
      channel.type === 'text' &&
      !channel.permissionsFor(this.client.user).has('READ_MESSAGE_HISTORY')
    ) {
      return msg.reply(`Sorry, I don't have permission to read ${channel}...`);
    }
    const messages = await channel.messages.fetch({ after: 1, limit: 1 });
    const message = messages.first();
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
