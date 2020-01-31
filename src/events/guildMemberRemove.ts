//Dependencies
import { Event } from 'klasa';
import _ from 'lodash';
import redis from 'redis';
import bluebird from 'bluebird';
import { GuildMember, TextChannel } from 'discord.js';

//Init
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

module.exports = class extends Event {
  async run(member: GuildMember) {
    // Deleting Messages
    if (
      _.includes(
        ['plus', 'pro'],
        await redisClient.hgetAsync('guild_tiers', member.guild.id)
      )
    ) {
      if (member.guild.settings.get('deleteMessagesChannels').length > 0)
        member.guild.settings
          .get('deleteMessagesChannels')
          .forEach(async (ch: string) => {
            const channel = member.guild.channels.get(ch);

            if (!(channel instanceof TextChannel)) return;

            let messages = await channel.messages.fetch({ limit: 100 });
            messages = messages.filter(msg => msg.author.id === member.id);
            channel.bulkDelete(messages);
          });
    }
  }
};
