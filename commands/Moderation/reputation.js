const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['rep'],
      cooldown: 10,
      permissionLevel: 6,
      description: 'Modify reputation',
      extendedHelp: 'Modify reputation of a member',
      usage: '<member:user> <+|-> <amount:integer{1,100}>',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, change, amount]) {
    msg.sendEmbed(
      (await member.editReputation(change, amount, msg.guild.id))
        ? new MessageEmbed().setTitle('Reputation modified').setColor('#2196f3')
        : new MessageEmbed()
            .setTitle('Banned')
            .setDescription('User was banned for reaching 0% reputation')
            .setColor('#2196f3'),
    );
  }
***REMOVED***
