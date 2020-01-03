const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      bucker: 3,
      cooldown: 10,
      description: 'Roll D12 Dice',
      extendedHelp: 'Roll a D12 dice',
    });
  }

  async run(msg) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} rolled D12`)
        .setDescription(
          `Rolling a D12... 🎲 **${Math.ceil(Math.random() * 12)}**`
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
