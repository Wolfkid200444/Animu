const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['owo', 'owofy'],
      cooldown: 10,
      description: 'Owoify your text',
      usage: '<text:string>'
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
***REMOVED***
