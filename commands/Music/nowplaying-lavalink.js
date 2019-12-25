const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View currently playing music',
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

    const res = await queue.current();
    const track = await this.client.lVoice.decode(res.track);

    const durationCurrent = moment.duration(res.position);
    const hoursCurrent = durationCurrent.hours();
    const minutesCurrent = durationCurrent.minutes();
    const secondsCurrent = durationCurrent.seconds();
    const timeCurrent = `${hoursCurrent ? hoursCurrent : ''}${
      minutesCurrent ? `${minutesCurrent}:` : '0:'
    }${secondsCurrent}`;

    const durationTotal = moment.duration(track.length);
    const hoursTotal = durationTotal.hours();
    const minutesTotal = durationTotal.minutes();
    const secondsTotal = durationTotal.seconds();
    const timeTotal = `${hoursTotal ? `${hoursTotal}:` : ''}${
      minutesTotal ? `${minutesTotal}:` : '0:'
    }${secondsTotal}`;

    msg.send(
      new MessageEmbed({
        title: 'Now Playing',
        description: `**[${track.title}](${track.uri})**\n\n${
          queue.player.status === 1 ? '▶' : '⏸'
        } ${timeCurrent}/${timeTotal}`,
        color: '#2196f3',
      })
    );
  }
***REMOVED***
