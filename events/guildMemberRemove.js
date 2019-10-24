//Dependencies
const { Event } = require('klasa');
const mongoose = require('mongoose');
const _ = require('lodash');
const redis = require('redis');
const bluebird = require('bluebird');

//Init
const Profile = mongoose.model('Profile');
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
    //Store roles in profile
    const profile = await Profile.findOne({ memberID: member.id }).exec();

    // Deleting Messages
    if (await redisClient.sismemberAsync('valid_guilds', member.guild.id)) {
      if (member.guild.settings.deleteMessagesChannels.length > 0)
        member.guild.settings.deleteMessagesChannels.forEach(async (ch) => {
          const channel = member.guild.channels.get(ch);
          let messages = await channel.messages.fetch({ limit: 100 });
          messages = messages.filter((msg) => msg.author.id === member.id);
          channel.bulkDelete(messages);
        });
    }

    if (
      profile &&
      member.guild.settings.mutedRole &&
      member.roles.find((r) => r.id === member.guild.settings.mutedRole)
    ) {
      profile.mutedIn.push(member.guild.id);
      await profile.save();
    } else if (profile && _.includes(profile.mutedIn, member.guild.id)) {
      const index = profile.mutedIn.indexOf(member.guild.id);
      profile.mutedIn.splice(index, 1);
      profile.save();
    }
  }
***REMOVED***
