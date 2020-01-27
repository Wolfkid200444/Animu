const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const redis = require('redis');
const bluebird = require('bluebird');

// Init
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Skip a song',
    });
  }

  async run(msg) {
    if (!msg.member.voice.channel)
      return msg.send(
        new MessageEmbed({
          title: 'Not in VC',
          description: 'You must be in a voice channel to skip songs',
          color: '#f44336',
        })
      );

    if (msg.member.voice.channel.id !== msg.guild.me.voice.channel.id)
      return msg.send(
        new MessageEmbed({
          title: 'Not in Correct VC',
          description:
            'You must be in the same voice channel as Animu to skip songs',
          color: '#f44336',
        })
      );

    const queue = this.client.lVoice.queues.get(msg.guild.id);

    if (
      queue.player.status !== 1 && // Playing
      queue.player.status !== 2 // Paused
    )
      return msg.send(
        new MessageEmbed({
          title: 'No song playing',
          description: 'No song is playing currently',
          color: '#f44336',
        })
      );

    if (
      (await msg.hasAtLeastPermissionLevel(6)) ||
      msg.member.roles.find(
        r => r.id === msg.guild.settings.djRole || r.name.toLowerCase() === 'dj'
      )
    ) {
      const tracks = await queue.tracks(0, -1);

      if (tracks.length > 0) await queue.next();
      else {
        await queue.clear();
        await queue.stop();
      }

      msg.send(
        new MessageEmbed({
          title: 'Skipped',
          description: 'Skipped song',
          color: '#2196f3',
        })
      );
    } else {
      const hasVoted = await redisClient.sismemberAsync(
        `skip_votes:${msg.guild.id}`,
        msg.member.id
      );

      if (hasVoted)
        return msg.send(
          new MessageEmbed({
            title: 'Already Voted',
            description: 'You have already voted to skip this song',
            color: '#2196f3',
          })
        );

      await redisClient.saddAsync(`skip_votes:${msg.guild.id}`, msg.member.id);

      const voters = await redisClient.smembersAsync(
        `skip_votes:${msg.guild.id}`
      );

      if (
        voters.length >=
        Math.round((msg.guild.me.voice.channel.members.size - 1) / 2)
      ) {
        const tracks = await queue.tracks(0, -1);

        if (tracks.length > 0) await queue.next();
        else {
          await queue.clear();
          await queue.stop();
        }

        msg.send(
          new MessageEmbed({
            title: 'Skipped',
            description: 'Skipped song',
            color: '#2196f3',
          })
        );
      } else {
        msg.send(
          new MessageEmbed({
            title: 'Voted',
            description: `${voters.length}/${Math.round(
              (msg.guild.me.voice.channel.members.size - 1) / 2
            )} votes to skip the current song`,
            color: '#2196f3',
          })
        );
      }
    }
  }
};
