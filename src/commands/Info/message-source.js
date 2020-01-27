const { Command } = require('klasa');
const { shorten } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['message-src', 'messagesource', 'msgsource', 'msgsrc'],
      description: 'Get source of a message',
      cooldown: 10,
      usage: '<message:message>',
    });
  }

  async run(msg, [message]) {
    return msg.send(`\`${shorten(message.content, 1990)}\``);
  }
};
