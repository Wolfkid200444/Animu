const { Command } = require('klasa');
const prompt = require('discordjs-prompter');
const { randomRange } = require('../../util/util');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'The last to pump the balloon before it pops is the loser',
      usage: '<opponent:user>',
    });
  }

  async run(msg, [opponent]) {
    if (opponent.bot) return msg.reply('Bots may not be played against.');
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
      const verification = await prompt.reaction(msg.channel, {
        question: `${opponent}, do you accept this challenge?`,
        userId: opponent.id,
        timeout: 30000,
      });

      if (!verification || verification === 'no') {
        await redisClient.hdelAsync('active_games', msg.channel.id);
        return msg.send('Looks like they declined...');
      }

      let userTurn = false;
      let winner = null;
      let remains = 500;
      let turns = 0;
      while (!winner) {
        const user = userTurn ? msg.author : opponent;
        let pump;
        ++turns;
        if (turns === 1) {
          await msg.send(`${user} pumps the balloon!`);
          pump = true;
        } else {
          pump =
            (await prompt.reaction(msg.channel, {
              question: `${user}, do you pump the balloon again?`,
              userId: user.id,
              timeout: 30000,
            })) === 'yes'
              ? true
              : false;
        }
        if (pump) {
          remains -= randomRange(25, 75);
          const popped = Math.floor(Math.random() * remains);
          if (popped <= 0) {
            await msg.send('The balloon pops!');
            winner = userTurn ? opponent : msg.author;
            break;
          }
          if (turns >= 3) {
            await msg.send(`${user} steps back!`);
            turns = 0;
            userTurn = !userTurn;
          }
        } else {
          turns = 0;
          userTurn = !userTurn;
        }
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      return msg.send(`And the winner is... ${winner}! Great job!`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }
};
