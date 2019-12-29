const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Guild = mongoose.model('Guild');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 7,
      aliases: ['removelevelperk'],
      runIn: ['text'],
      requiredPermissions: ['MANAGE_ROLES', 'EMBED_LINKS'],
      description: 'Yeet a level up perk',
      usage: '<level:number>',
    });
  }

  async run(msg, [level]) {
    const guild = await Guild.findOne({ guildID: msg.guild.id });

    guild.removeLevelPerk(level);

    msg.send(
      new MessageEmbed({
        title: 'Perk Deleted',
        description: 'Perk successfully removed',
        color: '#2196f3',
      })
    );
  }
***REMOVED***
