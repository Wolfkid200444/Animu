import { MessageEmbed } from 'discord.js';
import { Monitor, MonitorStore } from 'klasa';
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

  async run(message) {
    if (
      !_.includes(
        ['plus', 'pro'],
        await redisClient.hgetAsync('guild_tiers', message.guild.id)
      )
    )
      return;

    // Filters
    const filters = [];

    if (message.guild.settings.toxicityFilters.toxicity)
      filters.push('TOXICITY');
    if (message.guild.settings.toxicityFilters.severeToxicity)
      filters.push('SEVERE_TOXICITY');
    if (message.guild.settings.toxicityFilters.profanity)
      filters.push('PROFANITY');
    if (message.guild.settings.toxicityFilters.identityAttack)
      filters.push('IDENTITY_ATTACK');
    if (message.guild.settings.toxicityFilters.sexuallyExplicit)
      filters.push('SEXUALLY_EXPLICIT');
    if (message.guild.settings.toxicityFilters.flirtation)
      filters.push('FLIRTATION');
    if (message.guild.settings.toxicityFilters.threat) filters.push('THREAT');

    if (filters.length === 0) return;

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

    if (message.guild.settings.logChannels.reports)
      message.guild.channels
        .get(message.guild.settings.logChannels.reports)
        .send(
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

    if (message.guild.settings.deleteToxicMessages) await message.delete();
  }
};
