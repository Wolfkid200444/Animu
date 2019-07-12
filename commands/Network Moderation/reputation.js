const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['rep'],
      cooldown: 10,
      permissionLevel: 8,
      description: 'Modify reputation',
      extendedHelp:
        'Modify reputation of a member. This commmand can only be run by one of the senior moderators/Server Admins of Aldovia',
      usage: '<member:user> <+|-> <amount:integer{1,100}>',
      usageDelim: ' '
    });
  }

  async run(msg, [member, change, amount]) {
    msg.sendEmbed(
      (await member.editReputation(change, amount))
        ? new MessageEmbed().setTitle('Reputation modified').setColor('#2196f3')
        : new MessageEmbed()
            .setTitle('Banned')
            .setDescription('User was banned for reaching 0% reputation')
            .setColor('#2196f3')
    );
  }
***REMOVED***
