import { Monitor, MonitorStore } from 'klasa';
import _ from 'lodash';
import redis from 'redis';
import bluebird from 'bluebird';
import { model } from 'mongoose';
import { IGuild } from '../models/Guild';

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();
const Guild = model('Guild');

module.exports = class extends Monitor {
  constructor(store: MonitorStore, file: string[], dir: string) {
    super(store, file, dir, {
      ignoreOthers: false,
    });
  }

  async run(message) {
    if (message.channel.type === 'dm') return;

    if (!message.guild.settings.enableLevels) return;

    if (message.attachments.size > 0) return;

    if (
      !_.includes(
        ['lite', 'plus', 'pro'],
        await redisClient.hgetAsync('guild_tiers', message.guild.id)
      )
    )
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
        message.author.id
      )
    )
      proceedExp = false;

    if (proceedExp) {
      const levelUps = await message.author.addExp(
        1 * message.guild.settings.expRate,
        message.guild.id
      );

      //If member actually levelled up
      if (levelUps.length) {
        const guild: IGuild = await (<Promise<IGuild>>(
          Guild.findOne({ guildID: message.guild.id }).exec()
        ));
        levelUps.forEach(level => {
          message.author.send(
            `Congrats, you just levelled up and reached Level ${level} in ${message.guild.name} 🎉`
          );

          const index = guild.levelPerks.findIndex(l => l.level === level);
          if (index < 0) return true;

          //Assign reward(s)
          if (guild.levelPerks[index]) {
            if (guild.levelPerks[index].badge)
              message.author.giveBadge(
                guild.levelPerks[index].badge,
                message.guild.id
              );

            if (guild.levelPerks[index].role) {
              const role = message.guild.roles.get(
                r => r.name === guild.levelPerks[index].role
              );

              message.member.roles.add(role);
            }

            if (guild.levelPerks[index].rep)
              message.author.editReputation(
                '+',
                guild.levelPerks[index].rep,
                message.guild.id
              );
          }
        });
      }

      //Adding to cache
      await redisClient.saddAsync(
        `recent_messages:${message.guild.id}`,
        message.author.id
      );
      setTimeout(async () => {
        //Remove from cache
        await redisClient.sremAsync(
          `recent_messages:${message.guild.id}`,
          message.author.id
        );
      }, message.guild.settings.expTime * 1000);
    }
  }
};
