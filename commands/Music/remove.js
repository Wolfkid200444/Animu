const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');

//Init
const MusicQueue = model('MusicQueue');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Remove a song from Queue',
      usage: '<index:number{1}>',
    });
  }

  async run(msg, [index]) {
    const musicQueue = await MusicQueue.findOne({
      guildID: msg.guild.id,
    }).exec();

    if (!msg.member.voice.channel)
      return msg.send(
        new MessageEmbed({
          title: 'Not in VC',
          description: 'You must be in a voice channel to remove a song',
          color: '#f44336',
        }),
      );

    if (msg.member.voice.channel.id !== msg.guild.me.voice.channel.id)
      return msg.send(
        new MessageEmbed({
          title: 'Not in Correct VC',
          description:
            'You must be in the same voice channel as Animu to remove a song',
          color: '#f44336',
        }),
      );

    if (!musicQueue)
      return msg.send(
        new MessageEmbed({
          title: 'No song playing',
          description: 'No song is playing currently',
          color: '#f44336',
        }),
      );

    if (
      !(await msg.hasAtLeastPermissionLevel(6)) &&
      !msg.member.roles.find(
        (r) =>
          r.id === msg.guild.settings.djRole || r.name.toLowerCase() === 'dj',
      )
    )
      return msg.send(
        new MessageEmbed({
          title: 'DJ Only Command',
          description: 'Only members with DJ role can use this command',
          color: '#f44336',
        }),
      );

    if (!musicQueue.songs[index])
      return msg.send(
        new MessageEmbed({
          title: 'Not Found',
          description:
            "The song you're trying to remove from queue isn't in the queue",
          color: '#f44336',
        }),
      );

    const song = musicQueue.songs.filter((song, i) => i === index)[0];

    musicQueue.songs = musicQueue.songs.filter((song, i) => i !== index);

    await musicQueue.save();

    msg.send(
      new MessageEmbed({
        title: 'Removed',
        description: `**${song.title}** Removed`,
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
