const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      bucker: 3,
      cooldown: 10,
      description: 'Roll D8 Dice',
      extendedHelp: 'Roll a D8 dice'
    });
  }

  async run(msg) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} rolled D8`)
        .setDescription(
          `Rolling a D8... 🎲 **${Math.ceil(Math.random() * 8)}**`
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
