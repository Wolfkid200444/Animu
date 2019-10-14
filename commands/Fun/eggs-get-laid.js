const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['dark-light'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Eggs get laid',
      usage: '[user:member]',
    });
  }

  async run(msg, [user = msg.author]) {
    msg.send(`${user}`, {
      files: [`${__dirname}/../../images/eggs-get-laid.png`],
    });
  }
***REMOVED***
