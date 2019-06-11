//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment');

//Init

//Main
module.exports = class ServerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'server',
      aliases: [],
      group: 'stats',
      memberName: 'server',
      throttling: {
        usages: 1,
        duration: 30
      },
      guildOnly: true,
      description: 'View server stats',
      examples: ['server']
    });
  }

  async run(msg) {
    return msg.embed(
      new RichEmbed()
        .setTitle('Server Stats')
        .addField('Total Members', msg.guild.memberCount)
        .addField(
          'Humans',
          msg.guild.members.filter(member => !member.user.bot).size
        )
        .addField(
          'Bots',
          msg.guild.members.filter(member => member.user.bot).size
        )
        .addField(
          'Server Age',
          `${moment().diff(msg.guild.createdAt, 'M')} months`
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
