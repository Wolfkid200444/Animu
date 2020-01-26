const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['sb', 'activeBadge', 'selectBadge'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 30,
      description: 'Set a badge as active badge',
      usage: '<badge:...string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [badge]) {
    msg.sendEmbed(
      (await msg.author.setActiveBadge(badge, msg.guild.id))
        ? new MessageEmbed().setTitle('Badge Active').setColor('#2196f3')
        : new MessageEmbed()
            .setTitle('Badge not found')
            .setDescription(
              "You don't have the badge you're trying to set as active",
            )
            .setColor('#f44336'),
    );
  }
***REMOVED***
