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
      aliases: ['repeat'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Loop Queue or a single song',
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
          description: 'You must be in a voice channel to loop',
          color: '#f44336',
        }),
      );

    if (msg.member.voice.channel.id !== msg.guild.me.voice.channel.id)
      return msg.send(
        new MessageEmbed({
          title: 'Not in Correct VC',
          description: 'You must be in the same voice channel as Animu to loop',
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

    if (musicQueue.loop === 'disabled') musicQueue.loop = 'queue';
    else if (musicQueue.loop === 'queue') musicQueue.loop = 'singe';
    else musicQueue.loop = 'disabled';

    await musicQueue.save();

    msg.send(
      new MessageEmbed({
        title:
          musicQueue.loop === 'disabled'
            ? 'Loop Disabled'
            : musicQueue.loop === 'queue'
            ? 'Loop Enabled'
            : 'Loop Mode Changed',
        description: `Loop Mode: ${_.capitalize(musicQueue.loop)}`,
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
