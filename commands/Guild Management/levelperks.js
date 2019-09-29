const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Guild = mongoose.model('Guild');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 7,
      aliases: ['viewlevelperks', 'getlevelperks'],
      runIn: ['text'],
      description: 'View perks for leveling up',
    });
  }

  async run(msg) {
    const guild = await Guild.findOne({ guildID: msg.guild.id });

    let str = '';

    if (guild.levelPerks.length < 1) str = 'No Level Perks Set';
    else
      guild.levelPerks.forEach((levelPerk) => {
        str += `Level **${levelPerk.level}** - ${
          levelPerk.badge ? levelPerk.badge + ' (Badge) ' : ''
        }${levelPerk.role ? levelPerk.role + ' (Role) ' : ''}${
          levelPerk.rep ? levelPerk.rep + ' (Rep)' : ''
        }\n`;
      });

    msg.send(
      new MessageEmbed({
        title: 'Level up Perks',
        description: str,
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
