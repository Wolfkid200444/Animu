const { Command } = require('klasa');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['crime-coefficient'],
      cooldown: 10,
      description: 'Determine Crime Coefficient of a user',
      usage: '[user:user]',
    });
  }

  async run(msg, [user = msg.author]) {
    if (user.id === this.client.user.id)
      return msg.reply("Me? I-I'm not dangerous, I promise!");
    const random = MersenneTwister19937.seed(user.id);
    const coefficient = integer(0, 500)(random);
    let res;
    if (coefficient < 100)
      res =
        'Suspect is not a target for enforcement action. The trigger of the Dominator will be locked.';
    else if (coefficient > 300)
      res =
        'Suspect poses a serious threat to society. Lethal force is authorized. The Dominator will automatically switch to Lethal Eliminator.';
    else
      res =
        'Suspect is classified as a latent criminal and is a target for enforcement action. Dominator is set to Non-Lethal Paralyzer mode.';
    return msg.reply(
      `${
        msg.author.id === user.id ? 'Your' : `Suspect ${user.username}'s`
      } Crime Coefficient is ${coefficient}. ${res}`,
    );
  }
***REMOVED***
