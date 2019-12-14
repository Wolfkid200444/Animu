const { Inhibitor } = require('klasa');
const { model } = require('mongoose');
const redis = require('redis');
const bluebird = require('bluebird');

const Guild = model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Inhibitor {
  async run() {
    return false;
  }

  async init() {
    const guilds = await Guild.find({}).exec();

    guilds.forEach(async guild => {
      await redisClient.hsetAsync('guild_tiers', guild.guildID, guild.tier);
    });

    await redisClient.hsetAsync('guild_tiers', '628931282851856394', 'pro'); //Setting Dev Server's Tier to 'pro'
  }
***REMOVED***
