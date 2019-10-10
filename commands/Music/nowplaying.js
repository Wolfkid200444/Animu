const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');

//Init
const MusicQueue = model('MusicQueue');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['np'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'View Currently Playing Song',
    });
  }

  async run(msg) {
    const musicQueue = await MusicQueue.findOne({
      guildID: msg.guild.id,
    }).exec();

    if (!musicQueue)
      return msg.send(
        new MessageEmbed({
          title: 'No song playing',
          description: 'No song is playing currently',
          color: '#f44336',
        }),
      );

    msg.send(
      new MessageEmbed({
        title: 'Now Playing',
        description: `Now playing: **${musicQueue.songs[0].title}**`,
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
