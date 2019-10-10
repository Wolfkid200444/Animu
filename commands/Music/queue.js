const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');

//Init
const MusicQueue = model('MusicQueue');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['q'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View Currently Playing Queue',
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
        title: 'Server Queue',
        description: musicQueue.songs
          .map((song, i) => `${i + 1} **-** ${song.title}`)
          .join('\n'),
        color: '#2196f3',
      }).setFooter(`${musicQueue.songs.length} Song(s) in Queue`),
    );
  }
***REMOVED***
