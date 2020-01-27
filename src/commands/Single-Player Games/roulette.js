const { Command } = require('klasa');
const { oneLine } = require('common-tags');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'Play a game of roulette',
      usage: '<space:string>',
    });

    this.red = [
      1,
      3,
      5,
      7,
      9,
      12,
      14,
      16,
      18,
      19,
      21,
      23,
      25,
      27,
      30,
      32,
      34,
      36,
    ];
    this.black = [
      2,
      4,
      6,
      8,
      10,
      11,
      13,
      15,
      17,
      20,
      22,
      24,
      26,
      28,
      29,
      31,
      33,
      35,
    ];
    this.numbers = [0].concat(this.red, this.black);
    this.dozens = ['1-12', '13-24', '25-36'];
    this.halves = ['1-18', '19-36'];
    this.columns = ['1st', '2nd', '3rd'];
    this.parity = ['even', 'odd'];
    this.colors = ['red', 'black'];
  }

  async run(msg, [space]) {
    if (
      !this.numbers.includes(Number.parseInt(space, 10)) &&
      !this.dozens.includes(space) &&
      !this.halves.includes(space) &&
      !this.columns.includes(space.toLowerCase()) &&
      !this.parity.includes(space.toLowerCase()) &&
      !this.colors.includes(space.toLowerCase())
    )
      return oneLine`
							Invalid space, please enter either a specific number from 0-36, a range of dozens (e.g. 1-12), a range of
							halves (e.g. 1-18), a column (e.g. 1st), a color (e.g. black), or a parity (e.g. even).
            `;
    space = space.toLowerCase();

    const number = Math.floor(Math.random() * 37);
    const color = number ? (this.red.includes(number) ? 'RED' : 'BLACK') : null;
    const win = this.verifyWin(space, number);
    return msg.reply(
      `The result is **${number}${color ? ` ${color}` : ''}**. ${
        win ? 'You win!' : 'You lose...'
      }`,
    );
  }

  verifyWin(choice, result) {
    if (this.dozens.includes(choice) || this.halves.includes(choice)) {
      const range = choice.split('-');
      return result >= range[0] && range[1] >= result;
    }
    if (this.colors.includes(choice)) {
      if (choice === 'black') return this.black.includes(result);
      if (choice === 'red') return this.red.includes(result);
    }
    if (this.parity.includes(choice)) return this.parity[result % 2] === choice;
    if (this.columns.includes(choice))
      return this.columns[(result - 1) % 3] === choice;
    const number = Number.parseInt(choice, 10);
    if (this.numbers.includes(number)) return result === number;
    if (!result) return false;
    return false;
  }
};
