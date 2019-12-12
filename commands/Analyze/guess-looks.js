const { Command } = require('klasa');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      cooldown: 10,
      description: 'You look ... gay?',
      usage: '[user:user]',
    });
    this.genders = ['male', 'female'];
  }

  async run(msg, [user = msg.author]) {
    if (user.id === this.client.user.id)
      return msg.reply('I look beyond perfect ≧◡≦');

    const authorUser = user.id === msg.author.id;
    const random = MersenneTwister19937.seed(user.id);
    const gender = this.genders[integer(0, this.genders.length - 1)(random)];
    const eyeColor = eyeColors[integer(0, eyeColors.length - 1)(random)];
    const hairColor = hairColors[integer(0, hairColors.length - 1)(random)];
    const hairStyle = hairStyles[integer(0, hairStyles.length - 1)(random)];
    const age = integer(10, 100)(random);
    const feet = integer(3, 7)(random);
    const inches = integer(0, 11)(random);
    const weight = integer(50, 300)(random);
    const extra = extras[integer(0, extras.length - 1)(random)];
    return msg.reply(
      `I think ${
        authorUser ? 'you are' : `${user.username} is`
      } a ${age} year old ${gender} with ${eyeColor} eyes and ${hairStyle} ${hairColor} hair. ${
        authorUser ? 'You are' : `${gender === 'male' ? 'He' : 'She'} is`
      } ${feet}'${inches}" and weigh${
        authorUser ? '' : 's'
      } ${weight} pounds. Don't forget the ${extra}!`
    );
  }
***REMOVED***

const eyeColors = ['blue', 'brown', 'hazel', 'green', 'yellow'];

const hairColors = ['blonde', 'brown', 'red', 'black', 'grey', 'white', 'blue'];

const hairStyles = [
  'curly',
  'straight',
  'wavy',
  'long',
  'shoulder-length',
  'short',
  'balding',
];

const extras = [
  'freckles',
  'glasses',
  'dimples',
  'contacts',
  'loads of acne',
  'pretty smile',
  'braces',
];
