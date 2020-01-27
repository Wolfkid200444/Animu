const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      bucker: 3,
      cooldown: 10,
      description: 'Roll D100 Dice',
      extendedHelp: 'Roll a D100 dice',
    });
  }

  async run(msg) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} rolled D100`)
        .setDescription(
          `Rolling a D100... 🎲 **${Math.ceil(Math.random() * 100)}**`
        )
        .setColor('#2196f3')
    );
  }
};
