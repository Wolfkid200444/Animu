const { Inhibitor } = require('klasa');
const { model } = require('mongoose');
const _ = require('lodash');
const redis = require('redis');
const bluebird = require('bluebird');

const Guild = model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Inhibitor {
  async run(message, command) {
    // Lite+ Categories
    const liteCategories = [
      'Avatar Manipulation',
      'Image Manipulation',
      'Music',
      'Multi-Player Games',
      'Search',
    ];

    // Plus+ Categories
    const plusCategories = [];

    // Lite+ Commands
    const liteCommands = ['read', 'watch', 'addlevelperk', 'levelperks'];

    // Plus+ Commands
    const plusCommands = ['pixiv'];

    // Validation
    if (
      !_.includes(liteCategories, command.fullCategory[0]) &&
      !_.includes(plusCategories, command.fullCategory[0]) &&
      !_.includes(liteCommands, command.name) &&
      !_.includes(plusCommands, command.name)
    )
      return false;

    const guildTier = await redisClient.hgetAsync(
      'guild_tiers',
      message.guild.id
    );

    if (
      _.includes(liteCategories, command.fullCategory[0]) &&
      guildTier === 'free'
    )
      return 'This command is for Lite and Above tiers (Upgrade Now: https://patreon.com/Aldovia)';

    if (
      _.includes(plusCategories, command.fullCategory[0]) &&
      _.includes(['free', 'lite'], guildTier)
    )
      return 'This command is for Plus and Above tiers (Upgrade Now: https://patreon.com/Aldovia)';

    if (
      _.includes(liteCommands, command.name) &&
      _.includes(['free'], guildTier)
    )
      return 'This command is for Lite and Above tiers (Upgrade Now: https://patreon.com/Aldovia)';

    if (
      _.includes(plusCommands, command.name) &&
      _.includes(['free', 'lite'], guildTier)
    )
      return 'This command is for Plus and Above tiers (Upgrade Now: https://patreon.com/Aldovia)';

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
