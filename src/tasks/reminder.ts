import { Task } from 'klasa';
import { TextChannel } from 'discord.js';

module.exports = class extends Task {
  async run({ channel, user, text }) {
    const _channel = this.client.channels.get(channel);
    if (_channel && _channel instanceof TextChannel)
      await _channel.send(`<@${user}> You wanted me to remind you: ${text}`);
  }
};
