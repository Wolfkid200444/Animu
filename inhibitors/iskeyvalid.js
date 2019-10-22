const { Inhibitor } = require('klasa');
const { model } = require('mongoose');
const redis = require('redis');
const bluebird = require('bluebird');

const Guild = model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Inhibitor {
  async run(message) {
    if (!(await redisClient.sismemberAsync('valid_guilds', message.guild.id)))
      return true;
    else return false;
  }

  async init() {
    const guilds = await Guild.find({}).exec();

    guilds.forEach(async (guild) => {
      if (guild.daysLeft != 0) {
        await redisClient.saddAsync('valid_guilds', guild.guildID);
        await redisClient.hsetAsync('guild_tiers', guild.guildID, guild.tier);
      }
    });

    await redisClient.saddAsync('valid_guilds', '628931282851856394'); //Adding Dev Server
    await redisClient.hsetAsync('guild_tiers', '628931282851856394', 'pro'); //Setting Dev Server's Tier to 'pro'
  }
***REMOVED***
