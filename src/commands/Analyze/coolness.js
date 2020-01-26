const { Command } = require('klasa');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['cool'],
      cooldown: 10,
      description: 'Are you cool?',
      usage: '[user:user]',
    });
  }

  async run(msg, [user = msg.author]) {
    const authorUser = user.id === msg.author.id;
    if (user.id === this.client.user.id)
      return msg.reply("I'm beyond cool ≧◡≦");

    const random = MersenneTwister19937.seed(user.id);
    const coolness = integer(0, qualities.length - 1)(random);
    return msg.reply(
      `${authorUser ? 'You are' : `${user.username} is`} ${qualities[coolness]}`
    );
  }
***REMOVED***

// Qualityes
const qualities = [
  'the coolest being to walk this Earth.',
  'extremely amazingly amazing.',
  'as cool as ice.',
  'cooler than cool.',
  'an extremely cool dude.',
  'pretty sweet, not gonna lie.',
  'okay, nothing special.',
  'just not all that neat.',
  'awful, honestly.',
  'terrible in every way.',
  'an absolute train wreck.',
  'a horrible, horrible person.',
  "the worst person I've ever had the displeasure of knowing.",
];
