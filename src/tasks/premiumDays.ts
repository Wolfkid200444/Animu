import { Task } from 'klasa';
import { botEnv } from '../config/keys';
import { model } from 'mongoose';
import redis from 'redis';
import bluebird from 'bluebird';
import { IGuildModel } from '../models/Guild';

// Init
const Guild: IGuildModel = <IGuildModel>model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

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
};
