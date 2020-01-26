const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const paginationEmbed = require('discord.js-pagination');
const redis = require('redis');
const bluebird = require('bluebird');

// Init
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['q'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View music Queue',
    });
  }

  async run(msg) {
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

    const res = await queue.tracks();
    const tracks = await this.client.lVoice.decode(res);

    const resNP = await queue.current();
    const trackNP = await this.client.lVoice.decode(resNP.track);

    const looping = await redisClient.sismemberAsync(
      'loop_guilds',
      msg.guild.id
    );

    const embedsArr = [];
    let songList = '';

    if (tracks.length > 0)
      tracks.forEach((track, i) => {
        const durationTotal = moment.duration(track.info.length);
        const hoursTotal = durationTotal.hours();
        const minutesTotal = durationTotal.minutes();
        const secondsTotal = durationTotal.seconds();
        const timeTotal = `${hoursTotal ? `${hoursTotal}:` : ''}${
          minutesTotal ? `${minutesTotal}:` : '0:'
        }${secondsTotal}`;

        songList += `${i + 1} **-** ${track.info.title} (${timeTotal})\n\n`;

        if ((i + 1) % 10 === 0 || i === tracks.length - 1) {
          embedsArr.push(
            this.createQueueEmbed(resNP, trackNP, queue, songList, looping)
          );
          songList = '';
        }
      });
    else
      embedsArr.push(
        this.createQueueEmbed(
          resNP,
          trackNP,
          queue,
          '[No Songs in Queue]',
          looping
        )
      );

    paginationEmbed(msg, embedsArr);
  }

  createQueueEmbed(resNP, trackNP, queue, songList, looping) {
    const durationCurrent = moment.duration(resNP.position);
    const hoursCurrent = durationCurrent.hours();
    const minutesCurrent = durationCurrent.minutes();
    const secondsCurrent = durationCurrent.seconds();
    const timeCurrent = `${hoursCurrent ? hoursCurrent : ''}${
      minutesCurrent ? `${minutesCurrent}:` : '0:'
    }${secondsCurrent}`;

    const durationTotal = moment.duration(trackNP.length);
    const hoursTotal = durationTotal.hours();
    const minutesTotal = durationTotal.minutes();
    const secondsTotal = durationTotal.seconds();
    const timeTotal = `${hoursTotal ? `${hoursTotal}:` : ''}${
      minutesTotal ? `${minutesTotal}:` : '0:'
    }${secondsTotal}`;

    return new MessageEmbed({
      title: 'Server Queue',
      fields: [
        {
          name: 'Now Playing',
          value: `**[${trackNP.title}](${trackNP.uri})**\n\n${
            queue.player.status === 1 ? '▶' : '⏸'
          } ${timeCurrent}/${timeTotal}`,
        },
        {
          name: `Queued Songs ${looping ? '🔁' : ''}`,
          value: songList,
        },
      ],
      color: '#2196f3',
    });
  }
***REMOVED***
