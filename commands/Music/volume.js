const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { model } = require('mongoose');

//Init
const MusicQueue = model('MusicQueue');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['vol'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'View Currently Playing Song',
      usage: '[volume:int{1,100}]',
    });
  }

  async run(msg, [volume]) {
    const musicQueue = await MusicQueue.findOne({
      guildID: msg.guild.id,
    }).exec();

    if (!msg.member.voice.channel)
      return msg.send(
        new MessageEmbed({
          title: 'Not in VC',
          description: 'You must be in a voice channel to view/change volume',
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

    if (!volume)
      return msg.send(
        new MessageEmbed({
          title: 'Current Volume',
          description: `Current Volume is **${musicQueue.volume}%**`,
          color: '#2196f3',
        }),
      );

    console.log(volume);
    console.log(typeof volume);

    this.client.guilds
      .get(msg.guild.id)
      .me.voice.connection.dispatcher.setVolume(volume / 200);
    musicQueue.volume = volume;
    await musicQueue.save();

    msg.send(
      new MessageEmbed({
        title: 'Volume Changed',
        description: `Volume is changed to **${volume}%**`,
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
