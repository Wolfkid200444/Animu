const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['owo', 'owofy'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'OwO',
      usage: '<text:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [text]) {
    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} says`)
        .setDescription(text.replace(/r|l/g, 'w').replace(/R|L/g, 'W'))
        .setColor('#2196f3')
    );
  }
};
