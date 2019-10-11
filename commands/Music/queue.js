const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');
const paginationEmbed = require('discord.js-pagination');

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

    const embedsArr = [];
    let songList = '';

    musicQueue.songs.forEach((song, i) => {
      songList += `${i + 1} **-** ${song.title}\n`;
      if ((i + 1) % 10 === 0 || i === musicQueue.songs.length - 1) {
        embedsArr.push(
          new MessageEmbed({
            title: 'Server Queue',
            description: songList,
            color: '#2196f3',
          }),
        );
        songList = '';
      }
    });

    paginationEmbed(msg, embedsArr);
  }
***REMOVED***
