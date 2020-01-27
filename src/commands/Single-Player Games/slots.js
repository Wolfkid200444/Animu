const { Command } = require('klasa');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'Play a game of slots',
    });
    this.slots = ['🍇', '🍊', '🍐', '🍒', '🍋'];
  }

  async run(msg) {
    const slotOne = this.slots[Math.floor(Math.random() * this.slots.length)];
    const slotTwo = this.slots[Math.floor(Math.random() * this.slots.length)];
    const slotThree = this.slots[Math.floor(Math.random() * this.slots.length)];
    if (slotOne === slotTwo && slotOne === slotThree) {
      return msg.reply(stripIndents`
				${slotOne}|${slotTwo}|${slotThree}
				Wow! You won! Great job... er... luck!
			`);
    }
    return msg.reply(stripIndents`
			${slotOne}|${slotTwo}|${slotThree}
			Aww... You lost... Guess it's just bad luck, huh?
		`);
  }
};
