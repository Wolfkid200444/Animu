const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');
const redis = require('redis');
const bluebird = require('bluebird');

//Init
const Guild = model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['registerserver', 'reg-guild'],
      cooldown: 10,
      permissionLevel: 8,
      description: 'Register Guild',
      extendedHelp: 'Register a guild, use -1 in days field for infinite days',
      usage: '<guildID:string{18,18}> <lite|plus|pro> <days:number>',
      usageDelim: ' ',
    });
  }

  async run(msg, [guildID, tier, daysLeft]) {
    const existingGuild = await Guild.findOne({ guildID }).exec();

    if (existingGuild)
      return msg.send(
        new MessageEmbed({
          title: 'Already Registered',
          description: 'That Guild is already registered',
          color: '#f44336',
        }),
      );

    if (!this.client.guilds.get(guildID))
      return msg.send(
        new MessageEmbed({
          title: 'Guild not found',
          description:
            "It seems Animu isn't a part of the guild you're trying to register",
          color: '#f44336',
        }),
      );

    await new Guild({
      guildID: msg.guild.id,
      tier,
      daysLeft,
      levelPerks: [],
    }).save();

    await redisClient.saddAsync('valid_guilds', msg.guild.id);
    await redisClient.hsetAsync('guild_tiers', guildID, tier);

    msg.send(
      new MessageEmbed({
        title: 'Registered',
        description: 'That guild is successfully registered',
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
