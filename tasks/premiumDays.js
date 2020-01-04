const { Task } = require('klasa');
const { botEnv } = require('../config/keys');
const { model } = require('mongoose');
const redis = require('redis');
const bluebird = require('bluebird');

// Init
const Guild = model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    await Guild.updateMany(
      { premiumDaysLeft: { $gt: 0 } },
      { $inc: { premiumDaysLeft: -1 } },
      { multi: true }
    ).exec();

    await Guild.updateMany(
      { premiumDaysLeft: 0 },
      { tier: 'free' },
      { multi: true }
    ).exec();

    const expiredGuilds = await Guild.find({ premiumDaysLeft: 0 }).exec();

    expiredGuilds.forEach(async guild => {
      await redisClient.hsetAsync('guild_tiers', guild.guildID, guild.tier);
    });
  }
***REMOVED***
