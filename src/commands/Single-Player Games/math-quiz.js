const { Command } = require('klasa');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description:
        'See how fast you can answer a math problem in a given time limit',
      usage: '<easy|medium|hard|extreme|impossible>',
    });

    this.operations = ['+', '-', '*'];
    this.maxValues = {
      easy: 10,
      medium: 100,
      hard: 500,
      extreme: 1000,
      impossible: Number.MAX_SAFE_INTEGER,
    };
  }

  async run(msg, [difficulty]) {
    const value1 = Math.floor(Math.random() * this.maxValues[difficulty]) + 1;
    const value2 = Math.floor(Math.random() * this.maxValues[difficulty]) + 1;
    const operation = this.operations[
      Math.floor(Math.random() * this.operations.length)
    ];
    let answer;
    switch (operation) {
      case '+':
        answer = value1 + value2;
        break;
      case '-':
        answer = value1 - value2;
        break;
      case '*':
        answer = value1 * value2;
        break;
    }
    await msg.reply(stripIndents`
			**You have 10 seconds to answer this question.**
			${value1} ${operation} ${value2}
		`);
    const msgs = await msg.channel.awaitMessages(
      (res) => res.author.id === msg.author.id,
      {
        max: 1,
        time: 10000,
      },
    );
    if (!msgs.size) return msg.reply(`Sorry, time is up! It was ${answer}.`);
    if (msgs.first().content !== answer.toString())
      return msg.reply(`Nope, sorry, it's ${answer}.`);
    return msg.reply('Nice job! 10/10! You deserve some cake!');
  }
};
