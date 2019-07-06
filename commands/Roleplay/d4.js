const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      bucker: 3,
      cooldown: 10,
      description: 'Roll D4 Dice',
      extendedHelp: 'Roll a D4 dice'
    });
  }

  async run(msg) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} rolled D4`)
        .setDescription(
          `Rolling a D4... 🎲 **${Math.ceil(Math.random() * 4)}**`
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
