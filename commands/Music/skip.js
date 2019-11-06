const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');
const _ = require('lodash');

//Init
const MusicQueue = model('MusicQueue');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Skip currently playing song',
    });
  }

  async run(msg) {
    const musicQueue = await MusicQueue.findOne({
      guildID: msg.guild.id,
    }).exec();

    if (!msg.member.voice.channel)
      return msg.send(
        new MessageEmbed({
          title: 'Not in VC',
          description: 'You must be in a voice channel to skip a song',
          color: '#f44336',
        }),
      );

    if (msg.member.voice.channel.id !== msg.guild.me.voice.channel.id)
      return msg.send(
        new MessageEmbed({
          title: 'Not in Correct VC',
          description:
            'You must be in the same voice channel as Animu to skip a song',
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

    try {
      if (
        (await msg.hasAtLeastPermissionLevel(6)) ||
        msg.member.roles.find(
          (r) =>
            r.id === msg.guild.settings.djRole || r.name.toLowerCase() === 'dj',
        )
      )
        this.client.guilds
          .get(msg.guild.id)
          .me.voice.connection.dispatcher.end();
    } catch (e) {
      this.client.guilds.get(msg.guild.id).me.voice.channel.leave();
      await MusicQueue.deleteOne({ guildID: msg.guild.id }).exec();

      return msg.send(
        new MessageEmbed({
          title: 'No song playing',
          description: 'No song is playing currently',
          color: '#f44336',
        }),
      );
    }

    // If already Voted
    if (_.includes(musicQueue.skipVotes, msg.author.id))
      return msg.send(
        new MessageEmbed({
          title: 'Already Voted',
          description: "You've already voted to skip current song",
          color: '#f44336',
        }),
      );

    // Voting
    musicQueue.skipVotes.push(msg.author.id);

    if (
      musicQueue.skipVotes.length >=
      Math.round((msg.guild.me.voice.channel.members.size - 1) / 2)
    ) {
      try {
        this.client.guilds
          .get(msg.guild.id)
          .me.voice.connection.dispatcher.end();

        msg.send(
          new MessageEmbed({
            title: 'Skipped',
            description: `**${musicQueue.songs[0].title}** skipped`,
            color: '#2196f3',
          }),
        );
      } catch (e) {
        this.client.guilds.get(msg.guild.id).me.voice.channel.leave();
        await MusicQueue.deleteOne({ guildID: msg.guild.id }).exec();

        return msg.send(
          new MessageEmbed({
            title: 'No song playing',
            description: 'No song is playing currently',
            color: '#f44336',
          }),
        );
      }
    } else {
      await musicQueue.save();

      return msg.send(
        new MessageEmbed({
          title: 'Voted',
          description: `You voted to skip current song, **${
            musicQueue.skipVotes.length
          }/${Math.round(
            (msg.guild.me.voice.channel.members.size - 1) / 2,
          )} Votes**`,
          color: '#2196f3',
        }),
      );
    }
  }
***REMOVED***
