const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['rem'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Remove a song from queue',
      usage: '<index:number{1}>',
    });
  }

  async run(msg, [index]) {
    if (!msg.member.voice.channel)
      return msg.send(
        new MessageEmbed({
          title: 'Not in VC',
          description: 'You must be in a voice channel to remove a song',
          color: '#f44336',
        })
      );

    if (msg.member.voice.channel.id !== msg.guild.me.voice.channel.id)
      return msg.send(
        new MessageEmbed({
          title: 'Not in Correct VC',
          description:
            'You must be in the same voice channel as Animu to remove a song',
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
          title: 'Nothing Playing',
          description: 'Nothing is currently playing',
          color: '#f44336',
        })
      );

    if (
      !(await msg.hasAtLeastPermissionLevel(6)) &&
      !msg.member.roles.find(
        r => r.id === msg.guild.settings.djRole || r.name.toLowerCase() === 'dj'
      )
    )
      return msg.send(
        new MessageEmbed({
          title: 'DJ Only Command',
          description: 'Only members with DJ role can use this command',
          color: '#f44336',
        })
      );

    const allTracks = await queue.tracks();

    const tracks = await queue.tracks(
      allTracks.length - (index - 2),
      allTracks.length - (index - 2)
    );

    if (tracks.length < 1)
      return msg.send(
        new MessageEmbed({
          title: 'Invalid Number',
          description:
            "The song you are trying to remove doesn't seem to be in the queue",
          color: 0x2196f3,
        })
      );

    const trackInfo = await this.client.lVoice.decode(tracks[0]);

    await queue.remove(tracks[0]);

    msg.send(
      new MessageEmbed({
        title: 'Removed Song',
        description: `Removed **${trackInfo.title}** by **${trackInfo.author}**`,
        color: '#2196f3',
      })
    );
  }
};
