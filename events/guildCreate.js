const { Event } = require('klasa');
const mongoose = require('mongoose');
const redis = require('redis');
const bluebird = require('bluebird');

//Init
const Guild = mongoose.model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Event {
  async run(guild) {
    const existingGuild = await Guild.findOne({ guildID: guild.id }).exec();

    if (existingGuild) return;

    await new Guild({
      guildID: guild.id,
      tier: 'free',
      levelPerks: [],
    }).save();

    await redisClient.hsetAsync('guild_tiers', guild.id, 'free');
  }
***REMOVED***
