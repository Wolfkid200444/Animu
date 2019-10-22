const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');
const redis = require('redis');
const bluebird = require('bluebird');

const Guild = model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      cooldown: 10,
      permissionLevel: 8,
      description: 'Increase days of a guild registration',
      usage: '<guildID:string{18,18}> <daysToIncrease:number>',
      usageDelim: ' ',
    });
  }

  async run(msg, [guildID, daysToIncrease]) {
    const guild = await Guild.findOne({ guildID }).exec();

    if (!guild)
      return msg.send(
        new MessageEmbed({
          title: 'Invalid Guild',
          description: "Guild doesn't exist",
          color: '#f44336',
        }),
      );

    if (guild.daysLeft === 0) {
      await redisClient.saddAsync('valid_guilds', guild.guildID);
      await redisClient.hsetAsync('guild_tiers', guild.guildID, guild.tier);
    }

    guild.daysLeft += daysToIncrease;

    await guild.save();

    msg.send(
      new MessageEmbed({
        title: 'Guild Updated',
        description: 'Guild successfully updated',
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
