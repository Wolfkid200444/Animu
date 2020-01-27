const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['1-in', 'one-in'],
      cooldown: 10,
      description:
        'Attempt to win with a 1 in 1000 (or your choice) chance of winning',
      usage: '[chance:int{2,100000}]',
    });
  }

  async run(msg, [chance = 100]) {
    const loss = Math.floor(Math.random() * chance);
    if (!loss) return msg.reply('Nice job! 10/10! You deserve some cake!');
    return msg.reply('Nope, sorry, you lost.');
  }
};
