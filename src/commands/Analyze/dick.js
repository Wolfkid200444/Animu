const { Command } = require('klasa');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['penis', 'pee-pee', 'pp'],
      cooldown: 10,
      description: 'Smol pp',
      usage: '[user:user]',
    });
  }

  async run(msg, [user = msg.author]) {
    if (user.id === this.client.user.id)
      return msg.reply("B-baka I don't have a dick!");

    const clientAuthor = user.id === this.client.user.id;
    const random = MersenneTwister19937.seed(
      clientAuthor ? msg.author.id : user.id
    );
    const length = integer(0, 200)(random);
    return msg.reply(`8${'='.repeat(clientAuthor ? length + 1 : length)}D`);
  }
};
