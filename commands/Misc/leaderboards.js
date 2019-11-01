const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');
const Inventory = mongoose.model('Inventory');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['leaderboard'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View leaderboards',
      extendedHelp: 'View leaderboards',
      usage: '<coins|reputation>',
    });
  }

  async run(msg, [leaderboard]) {
    if (leaderboard === 'coins') {
      const richest10 = await Inventory.find(
        {},
        {},
        { sort: { coins: -1 }, limit: 10 },
      );

      let str = '';

      richest10.forEach((inv, i) => {
        if (this.client.users.get(inv.memberID))
          str += `${i + 1}) ${this.client.users.get(inv.memberID).username} - ${
            inv.coins
          } Coins ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}\n\n`;
        else str += '[Can we get an F?]';
      });

      msg.sendEmbed(
        new MessageEmbed({
          title: 'Top 10 Richest People in Animu',
          description: str,
          color: '#2196f3',
        }),
      );
    } else if (leaderboard === 'reputation') {
      const members = await Profile.find({
        reputation: { $elemMatch: { guildID: msg.guild.id } },
      });

      members.sort((a, b) => {
        const indexA = a.reputation.findIndex(
          (r) => r.guildID === msg.guild.id,
        );
        const indexB = b.reputation.findIndex(
          (r) => r.guildID === msg.guild.id,
        );
        return a.reputation[indexA].rep > b.reputation[indexB].rep ? -1 : 1;
      });

      const top10 = members.slice(0, 10);

      let str = '';

      top10.forEach((profile, i) => {
        const index = profile.reputation.findIndex(
          (r) => r.guildID === msg.guild.id,
        );

        if (this.client.users.get(profile.memberID))
          str += `${i + 1}) ${
            this.client.users.get(profile.memberID).username
          } - 🏆 ${profile.reputation[index].rep} ${
            i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''
          }\n\n`;
      });

      msg.sendEmbed(
        new MessageEmbed({
          title: `Top 10 Reputable members of ${msg.guild.name}`,
          description: str,
          color: '#2196f3',
        }),
      );
    }
  }
***REMOVED***
