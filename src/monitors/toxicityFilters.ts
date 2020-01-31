import { MessageEmbed, TextChannel } from 'discord.js';
import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import Perspective from 'perspective-api-client';
import { model } from 'mongoose';
import { perspectiveAPIKey } from '../config/keys';
import _ from 'lodash';
import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();
const perspective = new Perspective({ apiKey: perspectiveAPIKey });
const Log = model('Log');

module.exports = class extends Monitor {
  constructor(store: MonitorStore, file: string[], dir: string) {
    super(store, file, dir, {
      ignoreOthers: false,
    });
  }

  async run(message: KlasaMessage) {
    if (
      !_.includes(
        ['plus', 'pro'],
        await redisClient.hgetAsync('guild_tiers', message.guild.id)
      )
    )
      return;

    if (message.content.trim.length < 1) return;

    // Filters
    const filters = [];

    if (message.guild.settings.get('toxicityFilters.toxicity'))
      filters.push('TOXICITY');
    if (message.guild.settings.get('toxicityFilters.severeToxicity'))
      filters.push('SEVERE_TOXICITY');
    if (message.guild.settings.get('toxicityFilters.profanity'))
      filters.push('PROFANITY');
    if (message.guild.settings.get('toxicityFilters.identityAttack'))
      filters.push('IDENTITY_ATTACK');
    if (message.guild.settings.get('toxicityFilters.sexuallyExplicit'))
      filters.push('SEXUALLY_EXPLICIT');
    if (message.guild.settings.get('toxicityFilters.flirtation'))
      filters.push('FLIRTATION');
    if (message.guild.settings.get('toxicityFilters.threat'))
      filters.push('THREAT');

    if (filters.length === 0) return;

    try {
      const res = await perspective.analyze(message.cleanContent, {
        attributes: filters,
      });

      const filtersFailed = [];

      filters.forEach(filter => {
        if (res.attributeScores[filter].summaryScore.value >= 0.8) {
          filtersFailed.push(filter);
        }
      });

      if (filtersFailed.length === 0) return;

      await new Log({
        guildID: message.guild.id,
        event: 'toxicMessage',
        data: {
          authorID: message.author.id,
          channelID: message.channel.id,
          content: message.content,
          createdAt: message.createdAt,
          edits: message.edits,
          id: message.id,
          type: message.type,
          filtersFailed: filtersFailed,
        },
      }).save();

      if (message.guild.settings.get('logChannels.reports')) {
        const logChannel = message.guild.channels.get(
          message.guild.settings.get('logChannels.reports')
        );

        if (logChannel instanceof TextChannel)
          logChannel.send(
            new MessageEmbed({
              title: `Message by ${message.author.tag}`,
              description: `The following message failed **${
                filtersFailed.length
              }** filters:\n\n\`\`\`${message.cleanContent}\`\`\`\n(Sent in ${
                message.channel
              })\n\nFilters Failed: *${filtersFailed.join(', ')}*`,
              color: 0x2196f3,
            })
          );
      }

      if (message.guild.settings.get('deleteToxicMessages'))
        await message.delete();
    } catch (e) {}
  }
};
