import { Event, KlasaMessage } from 'klasa';
import { model } from 'mongoose';
import _ from 'lodash';
import redis from 'redis';
import bluebird from 'bluebird';
import { ILogModel } from '../models/Log';
import { TextChannel, DMChannel } from 'discord.js';

// Init
const Log = <ILogModel>model('Log');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

module.exports = class extends Event {
  async run(message: KlasaMessage) {
    if (!message.author) return;

    if (message.author.id === this.client.user.id) return;

    if (message.channel instanceof DMChannel) return;

    if (
      !_.includes(
        ['lite', 'plus', 'pro'],
        await redisClient.hgetAsync('guild_tiers', message.guild.id)
      )
    )
      return;

    await new Log({
      guildID: message.guild.id,
      event: 'messageDelete',
      data: {
        authorID: message.author.id,
        channelID: message.channel.id,
        content: message.content,
        createdAt: message.createdAt,
        edits: message.edits,
        id: message.id,
        type: message.type,
      },
    }).save();

    if (message.guild.settings.get('logChannels.deletedMessages')) {
      const delLogChannel = message.guild.channels.get(
        message.guild.settings.get('logChannels.deletedMessages')
      );

      if (delLogChannel instanceof TextChannel)
        delLogChannel.send(
          `A message by **${
            this.client.users.get(message.member.id).username
          }** was deleted at \`${new Date().toUTCString()}\` in **${
            message.channel.name
          }**:\n\`\`\`${message.content}\`\`\``
        );
    }
  }
};
