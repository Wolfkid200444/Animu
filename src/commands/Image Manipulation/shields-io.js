const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['shields-io-badge'],
      cooldown: 10,
      description: 'Generate a Shields IO badge',
      usage: '<subject:string> <status:string> [color:string]',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [subject, status, color = 'brightgreen']) {
    return msg.send({
      files: [
        {
          attachment: `https://img.shields.io/badge/${subject}-${status}-${color}.png`,
          name: `badge.png`,
        },
      ],
    });
  }
};
