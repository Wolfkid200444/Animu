const { Command } = require('klasa');
const prompt = require('discordjs-prompter');
const { stripIndents } = require('common-tags');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'Play a game of tic-tac-toe with another user',
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

      const sides = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
      const taken = [];
      let userTurn = true;
      let winner = null;
      while (!winner && taken.length < 9) {
        const user = userTurn ? msg.author : opponent;
        const sign = userTurn ? 'X' : 'O';
        await msg.send(stripIndents`
					${user}, which side do you pick?
					\`\`\`
					${sides[0]} | ${sides[1]} | ${sides[2]}
					—————————
					${sides[3]} | ${sides[4]} | ${sides[5]}
					—————————
					${sides[6]} | ${sides[7]} | ${sides[8]}
					\`\`\`
				`);
        const filter = res => {
          const choice = res.content;
          return (
            res.author.id === user.id &&
            sides.includes(choice) &&
            !taken.includes(choice)
          );
        };
        const turn = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
        });
        if (!turn.size) {
          await msg.send('Sorry, time is up!');
          userTurn = !userTurn;
          continue;
        }
        const choice = turn.first().content;
        // eslint-disable-next-line require-atomic-updates
        sides[Number.parseInt(choice, 10)] = sign;
        taken.push(choice);
        if (this.verifyWin(sides)) winner = userTurn ? msg.author : opponent;
        userTurn = !userTurn;
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      return msg.send(winner ? `Congrats, ${winner}!` : 'Oh... The cat won.');
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }

  verifyWin(sides) {
    return (
      (sides[0] === sides[1] && sides[0] === sides[2]) ||
      (sides[0] === sides[3] && sides[0] === sides[6]) ||
      (sides[3] === sides[4] && sides[3] === sides[5]) ||
      (sides[1] === sides[4] && sides[1] === sides[7]) ||
      (sides[6] === sides[7] && sides[6] === sides[8]) ||
      (sides[2] === sides[5] && sides[2] === sides[8]) ||
      (sides[0] === sides[4] && sides[0] === sides[8]) ||
      (sides[2] === sides[4] && sides[2] === sides[6])
    );
  }
};
