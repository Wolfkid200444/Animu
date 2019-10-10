const { Command } = require('klasa');
const { MessageEmbed, Util } = require('discord.js');
const { model } = require('mongoose');
const { youtubeAPIKey, botEnv } = require('../../config/keys');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');

//Init
const MusicQueue = model('MusicQueue');
const Guild = model('Guild');
const Key = model('Key');
const youtube = new Youtube(youtubeAPIKey);

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['pl'],
      requiredPermissions: ['EMBED_LINKS', 'CONNECT', 'SPEAK'],
      cooldown: 5,
      description: 'Play Music',
      usage: '<music:...string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [music]) {
    const musicQueue = await MusicQueue.findOne({
      guildID: msg.guild.id,
    }).exec();

    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel)
      return msg.send(
        new MessageEmbed({
          title: 'Must be in a VC',
          description: 'You must be in a vc to play music',
          color: '#f44336',
        }),
      );

    const perms = voiceChannel.permissionsFor(this.client.user);
    if (!perms.has('CONNECT') || !perms.has('SPEAK'))
      return msg.send(
        "It seems I don't have perms in Voice Channel that you're currently in",
      );

    let video;
    try {
      video = await youtube.getVideo(music);
    } catch (error) {
      try {
        video = (await youtube.search(music, 1))[0];
      } catch (error) {
        return msg.send(
          new MessageEmbed({
            title: 'Music Not Found',
            description:
              "The music you're trying to play wasn't found on YouTube",
            color: '#f44336',
          }),
        );
      }
    }

    if (!video)
      return msg.send(
        new MessageEmbed({
          title: 'Music Not Found',
          description:
            "The music you're trying to play wasn't found on YouTube",
          color: '#f44336',
        }),
      );

    if (!musicQueue) {
      const queue = new MusicQueue({
        guildID: msg.guild.id,
        songs: [],
        volume: msg.guild.settings.defaultVolume,
      });

      queue.songs.push({
        title: Util.escapeMarkdown(video.title),
        url: video.url,
      });

      await queue.save();

      try {
        const connection = await voiceChannel.join();
        this.play(msg.guild.id, msg, connection, queue.songs[0], queue.volume);
      } catch (err) {
        await MusicQueue.deleteOne({ guildID: msg.guild.id }).exec();
        return msg.send(
          new MessageEmbed({
            title: "Can't Join",
            description: 'There was an error while trying to join VC',
            color: '#f44336',
          }),
        );
      }
    } else {
      musicQueue.songs.push({
        title: Util.escapeMarkdown(video.title),
        url: video.url,
      });

      await musicQueue.save();

      msg.send(
        new MessageEmbed({
          title: `Added to Queue`,
          description: `**${Util.escapeMarkdown(
            video.title,
          )}** is added to queue`,
          color: '#2196f3',
        }),
      );
    }
  }

  async play(guildID, msg, connection, song, volume) {
    let keyVersion;

    if (botEnv === 'production') {
      const guild = await Guild.findOne({ guildID }).exec();
      const key = await Key.findOne({ key: guild.key }).exec();
      keyVersion = key.version;
    } else keyVersion = 'pro';

    if (!song) {
      this.client.guilds.get(guildID).me.voice.channel.leave();
      await MusicQueue.deleteOne({ guildID }).exec();
      return;
    }

    msg.send(
      new MessageEmbed({
        title: 'Playing',
        description: `Playing **${song.title}**`,
        color: '#2196f3',
      }),
    );

    connection
      .play(
        await ytdl(song.url, {
          quality: 'highestaudio',
          filter: () => ['45'],
          highWaterMark: 1 << 25,
        }),
        {
          volume: volume / 200,
          type: 'opus',
          bitrate: keyVersion === 'lite' ? 92000 : 192000,
        },
      )
      .on('end', async () => {
        const musicQueue = await MusicQueue.findOne({ guildID }).exec();
        musicQueue.songs.shift();
        await musicQueue.save();
        this.play(
          guildID,
          msg,
          connection,
          musicQueue.songs[0],
          musicQueue.volume,
        );
      });
  }
***REMOVED***
