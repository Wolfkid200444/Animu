const { Event } = require('klasa');
const redis = require('redis');
const bluebird = require('bluebird');
const _ = require('lodash');

// Init
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Event {
  async run(oldMember) {
    if(oldMember.channel)
    if (
      oldMember.channel.members.size < 2 &&
      !_.includes(
        ['plus', 'pro'],
        await redisClient.hgetAsync('guild_tiers', oldMember.guild.id)
      )
    ) {
      const queue = this.client.lVoice.queues.get(oldMember.guild.id);
      if (
        queue.player.status !== 1 && // Playing
        queue.player.status !== 2 && // Paused
        queue.player.status !== 4 && // Errored
        queue.player.status !== 5 // Stuck
      )
        return;

      await queue.clear();
      await queue.stop();
      await queue.player.leave();
    }
  }
};
