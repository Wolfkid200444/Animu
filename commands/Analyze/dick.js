const { Command } = require('klasa');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['dick-size', 'penis', 'penis-size', 'pee-pee', 'pee-pee-size'],
      cooldown: 10,
      description: 'Determine the dick size of a user',
      usage: '[user:user]',
    });
  }

  async run(msg, [user = msg.author]) {
    const clientAuthor = user.id === this.client.user.id;
    const random = MersenneTwister19937.seed(
      clientAuthor ? msg.author.id : user.id,
    );
    const length = integer(0, 200)(random);
    return msg.reply(`8${'='.repeat(clientAuthor ? length + 1 : length)}D`);
  }
***REMOVED***
