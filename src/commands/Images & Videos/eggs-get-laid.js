const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['ATTACH_FILES'],
      cooldown: 10,
      description: 'When was the last time you got laid?',
      usage: '[user:member]',
    });
  }

  async run(msg, [user = msg.author]) {
    msg.send(`${user}`, {
      files: [`${__dirname}/../../../assets/images/eggs-get-laid.png`],
    });
  }
};
