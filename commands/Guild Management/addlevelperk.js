const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Guild = mongoose.model('Guild');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 7,
      aliases: ['updatelevelperk', 'updatelevelperks', 'addlevelperks'],
      runIn: ['text'],
      description: 'Add perks for leveling up',
      usage: '<level:number> <badge|rep|role> <perkValue:...string>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [level, perkName, perkValue]) {
    const guild = await Guild.findOne({ guildID: msg.guild.id });

    guild.addLevelPerk(level, perkName, perkValue);

    msg.send(
      new MessageEmbed({
        title: 'Perk Added/Updated',
        description: 'Perk successfully added/updated',
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
