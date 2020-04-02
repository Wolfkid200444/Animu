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
  async run(oldMessage: KlasaMessage, newMessage: KlasaMessage) {
    if (!oldMessage.author) return;

    if (oldMessage.author.id === this.client.user.id) return;

    if (oldMessage.channel instanceof DMChannel) return;

    if (
      !_.includes(
        ['lite', 'plus', 'pro'],
        await redisClient.hgetAsync('guild_tiers', oldMessage.guild.id)
      )
    )
      return;

    await new Log({
      guildID: oldMessage.guild.id,
      event: 'messageEdit',
      data: {
        authorID: oldMessage.author.id,
        channelID: oldMessage.channel.id,
        oldContent: oldMessage.content,
        newContent: newMessage.content,
        createdAt: oldMessage.createdAt,
        updatedAt: newMessage.editedAt,
        edits: newMessage.edits,
        id: newMessage.id,
        type: newMessage.type,
      },
    }).save();

    if (oldMessage.guild.settings.get('logChannels.editedMessages')) {
      const editLogChannel = oldMessage.guild.channels.get(
        oldMessage.guild.settings.get('logChannels.editedMessages')
      );

      if (editLogChannel instanceof TextChannel)
        editLogChannel.send(
          `A message by **${
            this.client.users.get(oldMessage.member.id).username
          }** was updated at \`${new Date().toUTCString()}\` in **${
            oldMessage.channel.name
          }** from\n\`\`\`${oldMessage.content}\`\`\`\nto\n\`\`\`${
            newMessage.content
          }\`\`\``
        );
    }
  }
};
