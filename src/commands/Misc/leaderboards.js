const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { numberWithCommas } = require('../../util/util');
const redis = require('redis');
const bluebird = require('bluebird');

//Init
const Profile = mongoose.model('Profile');
const Inventory = mongoose.model('Inventory');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['leaderboard'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View leaderboards',
      extendedHelp: 'View leaderboards',
      usage: '<coins|reputation|levels>',
    });
  }

  async run(msg, [leaderboard]) {
    if (leaderboard === 'coins') {
      const richest10 = await Inventory.find(
        {},
        {},
        { sort: { coins: -1 }, limit: 10 }
      );

      let str = '';

      richest10.forEach((inv, i) => {
        if (this.client.users.get(inv.memberID))
          str += `${i + 1}) ${
            this.client.users.get(inv.memberID).username
          } - ${numberWithCommas(inv.coins)} Coins ${
            i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''
          }\n\n`;
        else str += '[Can we get an F?]\n\n';
      });

      msg.sendEmbed(
        new MessageEmbed({
          title: 'Top 10 Richest People in Animu',
          description: str,
          color: '#2196f3',
        })
      );
    } else if (leaderboard === 'reputation') {
      if (!msg.guild.settings.enableReputation)
        return msg.sendEmbed(
          new MessageEmbed({
            title: 'Reputation is Disabled',
            description: 'Reputation is disabled by server owner',
            color: '0xf44336',
          })
        );

      const members = await Profile.find({
        reputation: { $elemMatch: { guildID: msg.guild.id } },
      });

      members.sort((a, b) => {
        const indexA = a.reputation.findIndex(r => r.guildID === msg.guild.id);
        const indexB = b.reputation.findIndex(r => r.guildID === msg.guild.id);
        return a.reputation[indexA].rep > b.reputation[indexB].rep ? -1 : 1;
      });

      const top10 = members.slice(0, 10);

      let str = '';

      top10.forEach((profile, i) => {
        const index = profile.reputation.findIndex(
          r => r.guildID === msg.guild.id
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
        })
      );
    } else if (leaderboard === 'levels') {
      const guildTier = await redisClient.hgetAsync(
        'guild_tiers',
        msg.guild.id
      );

      if (guildTier === 'free')
        throw 'Upgrade to Lite or above tier to use Levels (Upgrade Now: https://patreon.com/Aldovia)';

      const members = await Profile.find({
        level: { $elemMatch: { guildID: msg.guild.id } },
      });

      members.sort((a, b) => {
        const indexA = a.level.findIndex(r => r.guildID === msg.guild.id);
        const indexB = b.level.findIndex(r => r.guildID === msg.guild.id);
        return a.level[indexA].level > b.level[indexB].level ? -1 : 1;
      });

      const top10 = members.slice(0, 10);

      let str = '';

      top10.forEach((profile, i) => {
        const index = profile.level.findIndex(r => r.guildID === msg.guild.id);

        if (this.client.users.get(profile.memberID))
          str += `${i + 1}) ${
            this.client.users.get(profile.memberID).username
          } - Level ${profile.level[index].level} ${
            i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''
          }\n\n`;
      });

      msg.sendEmbed(
        new MessageEmbed({
          title: `Top 10 Active members of ${msg.guild.name}`,
          description: str,
          color: '#2196f3',
        })
      );
    }
  }
};
