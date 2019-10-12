const { Inhibitor } = require('klasa');
const { model } = require('mongoose');
const redis = require('redis');
const bluebird = require('bluebird');

const Guild = model('Guild');
const Key = model('Key');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Inhibitor {
  async run(message, command) {
    if (command.name === 'registerguild') return false;
    else if (
      !(await redisClient.sismemberAsync('valid_guilds', message.guild.id))
    )
      return true;
    else return false;
  }

  async init() {
    const guilds = await Guild.find({}).exec();

    guilds.forEach(async (guild) => {
      const key = await Key.findOne({ key: guild.key }).exec();

      if (key.daysLeft != 0)
        await redisClient.saddAsync('valid_guilds', guild.guildID);
    });

    await redisClient.saddAsync('valid_guilds', '628931282851856394'); //Adding Dev Server
  }
***REMOVED***
