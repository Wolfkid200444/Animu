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
      requiredPermissions: ['MANAGE_ROLES', 'EMBED_LINKS'],
      description: 'Give members a reason to level up',
      usage: '<level:number> <badge|rep|role> <perkValue:...string>',
      usageDelim: ' ',
      quotedStringSupport: true,
      extendedHelp:
        "\
Create Level Perk\n\
Before you create any level perks, make sure 'enableLevels' is enabled (it's enabled by default)\n\
\n\
Examples:\n\
- addlevelperk 10 role Weeb\n\
- addlevelperk 5 badge Weebling\n\
- addlevelperk 50 rep 100\n\
\n\
For more info about levels, visit this link: https://aldovia.moe/how-to-set-up-levels/\
      ",
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
      })
    );
  }
***REMOVED***
