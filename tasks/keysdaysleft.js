const { Task } = require('klasa');
const mongoose = require('mongoose');
const { botEnv } = require('../config/keys');
const redis = require('redis');
const bluebird = require('bluebird');

//Init
const Key = mongoose.model('Key');
const Guild = mongoose.model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Task {
  async run() {
    if (!botEnv === 'production') return;

    const keys = await Key.find({}).exec();

    keys.forEach(async (key) => {
      if (key.daysLeft > 0) key.daysLeft--;

      if (key.daysLeft === 0) {
        const guild = await Guild.findOne({ key: key.key }).exec();

        if (guild) await redisClient.sremAsync('valid_guilds', guild.guildID);
      }
      await key.save();
    });
  }
***REMOVED***
