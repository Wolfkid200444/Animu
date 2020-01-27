const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      permissionLevel: 8,
      description: 'Modify coins',
      extendedHelp: 'Modify coins of a member.',
      usage: '<member:user> <+|-> <amount:integer>',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, change, amount]) {
    await member.editCoins(change, amount);

    msg.sendEmbed(
      new MessageEmbed().setTitle('Coins Modified').setColor('#2196f3'),
    );
  }
};
