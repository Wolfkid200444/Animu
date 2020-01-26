const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['is-zero-twosday'],
      cooldown: 10,
      description: 'True weebs know about Zero Twosday',
    });
  }

  async run(msg) {
    return msg.send(
      `Today **is${new Date().getDay() === 2 ? '' : ' not'}** Zero Twosday.`
    );
  }
***REMOVED***
