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

    if (!musicQueue)
      return msg.send(
        new MessageEmbed({
          title: 'No song playing',
          description: 'No song is playing currently',
          color: '#f44336',
        }),
      );

    if (
      (await msg.hasAtLeastPermissionLevel(6)) ||
      msg.member.roles.find(
        (r) =>
          r.id === msg.guild.settings.djRole || r.name.toLowerCase() === 'dj',
      )
    )
      this.client.guilds.get(msg.guild.id).me.voice.connection.dispatcher.end();

    // If already Voted
    if (_.includes(musicQueue.skipVotes, msg.author.id))
      return msg.send(
        new MessageEmbed({
          title: 'Already Voted',
          description: "You've already voted to skip current song",
          color: '#f44336',
        }),
      );

    console.log(
      this.client.guilds.get(msg.guild.id).me.voice.connection.dispatcher,
    );

    // Voting
    musicQueue.skipVotes.push(msg.author.id);
    if (
      musicQueue.skipVotes.length >=
      (msg.guild.me.voice.channel.members.size - 1) / 2
    ) {
      this.client.guilds.get(msg.guild.id).me.voice.connection.dispatcher.end();

      msg.send(
        new MessageEmbed({
          title: 'Skipped',
          description: `**${musicQueue.songs[0].title}** skipped`,
          color: '#2196f3',
        }),
      );
    } else {
      await musicQueue.save();

      return msg.send(
        new MessageEmbed({
          title: 'Voted',
          description: `You voted to skip current song, **${
            musicQueue.skipVotes.length
          }/${(msg.guild.me.voice.channel.members.size - 1) / 2} Votes**`,
          color: '#2196f3',
        }),
      );
    }
  }
***REMOVED***
