const { Command } = require('klasa');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['ass', 'booty'],
      cooldown: 10,
      description: "That's one heck of a wretched butt",
      usage: '[user:user]',
    });
  }

  async run(msg, [user = msg.author]) {
    if (user.id === this.client.user.id)
      return msg.reply('B-baka you dare to analyze my butt!');
    const random = MersenneTwister19937.seed(user.id);
    const quality = integer(0, qualities.length - 1)(random);
    return msg.reply(
      `${user.id === msg.author.id ? 'ur' : `${user.username}'s`} butt is ${
        qualities[quality]
      }`
    );
  }
};

// Qualityes
const qualities = [
  'average at best',
  'pretty ok',
  'decent',
  'solid',
  'flat af',
  'meh',
  'out of this world bby :)',
  'tiny',
  'terrible',
  'nice ;)',
  'god-awful',
  'utterly unremarkable',
  'of exceptional quality',
  'incredible',
  'nice and smooth',
  'just so round... and out there...',
  'unbelievable',
  'so ugly only ur momma could love it',
  'bootylicious',
  'appalling',
  'heave-inducing',
  'unrepentantly uninteresting',
  'garbage-tier',
  'wretched',
  'regal',
];
