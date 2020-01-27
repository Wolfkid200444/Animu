const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'Get a robot generated based using your text',
      usage: '<text:string>',
    });
  }

  async run(msg, [text]) {
    return msg.send({
      files: [
        {
          attachment: `https://robohash.org/${text}`,
          name: `${text}.png`,
        },
      ],
    });
  }
};
