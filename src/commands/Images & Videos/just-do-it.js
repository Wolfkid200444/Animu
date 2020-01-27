const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['motivate'],
      cooldown: 10,
      description: 'Just Do It!',
    });
  }

  async run(msg) {
    msg.send('https://www.youtube.com/watch?v=ZXsQAXx_ao0');
  }
};
