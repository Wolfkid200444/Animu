const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['addbadge', 'assignbadge', 'rewardbadge'],
      cooldown: 10,
      permissionLevel: 6,
      description: 'Give badge',
      extendedHelp:
        'Give a badge to a member',
      usage: '<member:user> <badge:string>',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, badge]) {
    msg.sendEmbed(
      (await member.giveBadge(badge, msg.guild.id))
        ? new MessageEmbed().setTitle('Gave Badge').setColor('#2196f3')
        : new MessageEmbed()
            .setTitle('Badge already given')
            .setDescription('User already has the badge you are trying to give')
            .setColor('#f44336'),
    );
  }
***REMOVED***
