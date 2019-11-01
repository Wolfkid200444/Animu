const { Task } = require('klasa');
const mongoose = require('mongoose');
const { botEnv } = require('../config/keys');
const redis = require('redis');
const bluebird = require('bluebird');

//Init
const Guild = mongoose.model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Task {
  async run() {
    if (!botEnv === 'production') return;

    const guilds = await Guild.find({}).exec();

    guilds.forEach(async (guild) => {
      if (guild.daysLeft === 1) {
        await redisClient.sremAsync('valid_guilds', guild.guildID);
        await redisClient.hdelAsync('guild_tiers', guild.guildID);
        this.client.guilds
          .get(guild.guildID)
          .owner.send(
            'Your trial of Animu has expired, Join patreon to continue using Anime: https://patreon.com/Aldovia',
          );
      }

      if (guild.daysLeft > 0) guild.daysLeft--;

      await guild.save();
    });
  }
***REMOVED***
