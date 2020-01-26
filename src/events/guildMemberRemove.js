//Dependencies
const { Event } = require('klasa');
const _ = require('lodash');
const redis = require('redis');
const bluebird = require('bluebird');

//Init
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      enabled: true,
      once: false,
    });
  }

  async run(member) {
    // Deleting Messages
    if (
      _.includes(
        ['plus', 'pro'],
        await redisClient.hgetAsync('guild_tiers', member.guild.id)
      )
    ) {
      if (member.guild.settings.deleteMessagesChannels.length > 0)
        member.guild.settings.deleteMessagesChannels.forEach(async ch => {
          const channel = member.guild.channels.get(ch);
          let messages = await channel.messages.fetch({ limit: 100 });
          messages = messages.filter(msg => msg.author.id === member.id);
          channel.bulkDelete(messages);
        });
    }
  }
***REMOVED***
