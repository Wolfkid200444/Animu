const { Command } = require('klasa');
const prompt = require('discordjs-prompter');
const { stripIndents } = require('common-tags');
const { shuffle } = require('../../util/util');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'Play a game of Russian Roulette',
      usage: '<opponent:user>',
    });
  }

  async run(msg, [opponent]) {
    if (opponent.id === msg.author.id)
      return msg.reply('You may not play against yourself.');
    const current = await redisClient.hexistsAsync(
      'active_games',
      msg.channel.id
    );
    if (current) {
      const currentGame = await redisClient.hgetAsync(
        'active_games',
        msg.channel.id
      );
      return msg.reply(
        `Please wait until the current game of \`${currentGame}\` is finished.`
      );
    }

    await redisClient.hsetAsync('active_games', msg.channel.id, this.name);

    try {
      if (!opponent.bot) {
        const verification = await prompt.reaction(msg.channel, {
          question: `${opponent}, do you accept this challenge?`,
          userId: opponent.id,
          timeout: 30000,
        });

        if (!verification || verification === 'no') {
          await redisClient.hdelAsync('active_games', msg.channel.id);
          return msg.send('Looks like they declined...');
        }
      }
      let userTurn = true;
      const gun = shuffle([
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
      let round = 0;
      let winner = null;
      let quit = false;
      while (!winner) {
        const player = userTurn ? msg.author : opponent;
        const notPlayer = userTurn ? opponent : msg.author;
        if (gun[round]) {
          await msg.send(
            `**${player.tag}** pulls the trigger... **And dies!**`
          );
          winner = notPlayer;
        } else {
          const keepGoing =
            (await await prompt.reaction(msg.channel, {
              question: stripIndents`
						**${player.tag}** pulls the trigger... **And lives...**
						${opponent.bot ? 'Continue?' : `Will you take the gun, ${notPlayer}?`} (${8 -
                round -
                1} shots left)
					`,
              userId: opponent.bot ? msg.author.id : notPlayer.id,
              timeout: 30000,
            })) === 'yes'
              ? true
              : false;

          if (!keepGoing) {
            winner = notPlayer;
            quit = true;
          }
          round++;
          userTurn = !userTurn;
        }
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      if (quit)
        return msg.send(`${winner} wins, because their opponent was a coward.`);
      return msg.send(`The winner is ${winner}!`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }
};
