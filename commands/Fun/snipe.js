const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Log = mongoose.model('Log');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['snipe', 'undelete'],
      cooldown: 60,
      description: 'Express your reactions',
      extendedHelp: 'Express different reactions',
    });
  }

  async run(msg) {
    const deletedMsg = await Log.findOne({
      guildID: msg.guild.id,
      event: 'messageDelete',
      'data.channelID': msg.channel.id,
    })
      .sort({ _id: -1 })
      .exec();

    if (!deletedMsg)
      return msg.sendEmbed(
        new MessageEmbed({
          title: 'Oops!',
          description: 'No message was recently deleted in this channel',
          color: '#f44336',
        }),
      );

    msg.sendEmbed(
      new MessageEmbed({
        description: deletedMsg.data.content,
        author: {
          name: this.client.users.get(deletedMsg.data.authorID).username,
          iconURL: this.client.users
            .get(deletedMsg.data.authorID)
            .displayAvatarURL({ size: 64 }),
        },
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
