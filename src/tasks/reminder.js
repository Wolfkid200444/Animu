const { Task } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Task {
  async run({ channel, user, text }) {
    const _channel = this.client.channels.get(channel);
    if (_channel)
      await _channel.sendEmbed(
        new MessageEmbed()
          .setTitle('Reminder!')
          .setDescription(`<@${user}> You wanted me to remind you: ${text}`)
          .setColor('#2196f3')
      );
  }
***REMOVED***
