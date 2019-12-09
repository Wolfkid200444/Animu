const { Command } = require('klasa');
const prompt = require('discordjs-prompter');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['eer'],
      cooldown: 10,
      description:
        'Can you type arrow emoji faster than anyone else has ever typed them before?',
      usage: '<opponent:user>',
    });
    this.emojis = ['⬆', '↗', '➡', '↘', '⬇', '↙', '⬅', '↖'];
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

      let turn = 0;
      let aPts = 0;
      let oPts = 0;
      while (turn < 10) {
        ++turn;
        const emoji = this.emojis[
          Math.floor(Math.random() * this.emojis.length)
        ];
        await msg.send(emoji);
        const filter = res =>
          [msg.author.id, opponent.id].includes(res.author.id) &&
          res.content === emoji;
        const win = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
        });
        if (!win.size) {
          await msg.send('Hmm... No one even tried that round.');
          continue;
        }
        const winner = win.first().author;
        if (winner.id === msg.author.id) ++aPts;
        else ++oPts;
        await msg.send(`
					${winner} won this round!
					**${msg.author.username}:** ${aPts}
					**${opponent.username}:** ${oPts}
				`);
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      if (aPts === oPts) return msg.send("It's a tie!");
      const userWin = aPts > oPts;
      return msg.send(
        `You win ${userWin ? msg.author : opponent} with ${
          userWin ? aPts : oPts
        } points!`
      );
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }
***REMOVED***
