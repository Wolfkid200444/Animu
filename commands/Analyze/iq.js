const { Command } = require('klasa');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['intelligence-quotient'],
      cooldown: 10,
      description: 'Determine IQ of a user',
      usage: '[user:user]',
    });
  }

  async run(msg, [user = msg.author]) {
    if (user.id === this.client.user.id)
      return msg.reply(
        'My IQ score is beyond the comprehension of you mortals!',
      );

    const random = MersenneTwister19937.seed(user.id);
    const score = integer(20, 170)(random);
    return msg.reply(
      `${
        user.id === msg.author.id ? 'Your' : `${user.username}'s`
      } IQ score is ${score}.`,
    );
  }
***REMOVED***
