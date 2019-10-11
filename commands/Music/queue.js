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
    const nowPlaying = musicQueue.songs.shift();

    if (musicQueue.songs.length > 0)
      musicQueue.songs.forEach((song, i) => {
        songList += `${i + 1} **-** ${song.title}\n\n`;
        if ((i + 1) % 10 === 0 || i === musicQueue.songs.length - 1) {
          embedsArr.push(this.createQueueEmbed(nowPlaying, songList));
          songList = '';
        }
      });
    else
      embedsArr.push(this.createQueueEmbed(nowPlaying, '[No Songs in Queue]'));

    paginationEmbed(msg, embedsArr);
  }

  createQueueEmbed(nowPlaying, songList) {
    return new MessageEmbed({
      title: 'Server Queue',
      fields: [
        {
          name: 'Now Playing',
          value: nowPlaying.title,
        },
        {
          name: 'Queued Songs',
          value: songList,
        },
      ],
      color: '#2196f3',
    });
  }
***REMOVED***
