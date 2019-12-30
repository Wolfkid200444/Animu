const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Stop Music',
    });
  }

  async run(msg) {
    if (!msg.member.voice.channel)
      return msg.send(
        new MessageEmbed({
          title: 'Not in VC',
          description: 'You must be in a voice channel to stop the music',
          color: '#f44336',
        })
      );

    if (msg.member.voice.channel.id !== msg.guild.me.voice.channel.id)
      return msg.send(
        new MessageEmbed({
          title: 'Not in Correct VC',
          description:
            'You must be in the same voice channel as Animu to stop music',
          color: '#f44336',
        })
      );

    const queue = this.client.lVoice.queues.get(msg.guild.id);

    if (
      queue.player.status !== 1 && // Playing
      queue.player.status !== 2 && // Paused
      queue.player.status !== 4 && // Errored
      queue.player.status !== 5 // Stuck
    )
      return msg.send(
        new MessageEmbed({
          title: 'No song playing',
          description: 'No song is playing currently',
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

    await queue.clear();
    await queue.stop();
    await queue.player.leave();

    msg.send(
      new MessageEmbed({
        title: 'Stopped',
        description: 'Music stopped',
        color: '#2196f3',
      })
    );
  }
***REMOVED***
