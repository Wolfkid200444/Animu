const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');

const Guild = model('Guild');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: [
        'getguilds',
        'viewguilds',
        'view-guilds',
        'list-servers',
        'list-guilds',
      ],
      cooldown: 10,
      permissionLevel: 8,
      description: 'View Keys',
    });
  }

  async run(msg) {
    const guilds = await Guild.find({}).exec();

    let str = '';
    let totalNumber = guilds.length;

    guilds.splice(0, 20);

    guilds.forEach(async (guild) => {
      str += `**${this.client.guilds.get(guild.guildID).name}** (${
        guild.tier
      }) - ${guild.daysLeft} Days Left\n`;
    });

    msg.send(
      new MessageEmbed({
        title: 'Keys',
        description: str,
        color: '#2196f3',
      }).setFooter(`Showing ${guilds.length} of ${totalNumber} Guilds`),
    );
  }
***REMOVED***
