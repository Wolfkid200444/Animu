const { Monitor } = require('klasa');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false,
    });
  }

  async run(message) {
    if (!(await redisClient.sismemberAsync('valid_guilds', message.guild.id)))
      return;

    let proceedExp = true;

    //Blacklisted channels
    for (let i = 0; i < message.guild.settings.ignoreExpChannels.length; i++) {
      const ignoreExpChannel = message.guild.settings.ignoreExpChannels[i];
      if (message.channel.id === ignoreExpChannel) {
        proceedExp = false;
        break;
      }
    }

    //If recently sent a message
    if (
      await redisClient.sismemberAsync(
        `recent_messages:${message.guild.id}`,
        message.author.id,
      )
    )
      proceedExp = false;

    if (proceedExp) {
      const res = await message.author.addExp(
        1 * message.guild.settings.expRate,
        message.guild.id,
      );

      console.log(res);

      //Adding to cache
      await redisClient.saddAsync(
        `recent_messages:${message.guild.id}`,
        message.author.id,
      );
      setTimeout(async () => {
        //Remove from cache
        await redisClient.sremAsync(
          `recent_messages:${message.guild.id}`,
          message.author.id,
        );
      }, message.guild.settings.expTime * 1000);
    }
  }
***REMOVED***
