const { Command } = require('klasa');
const prompt = require('discordjs-prompter');
const { delay, randomRange } = require('../../util/util');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['western-gunfight'],
      cooldown: 10,
      description: 'Engage in a western gunfight against another user',
      usage: '<opponent:user>',
    });
    this.words = ['fire', 'draw', 'shoot', 'bang', 'pull', 'boom'];
  }

  async run(msg, [opponent]) {
    if (opponent.bot) return msg.reply('Bots may not be fought.');
    if (opponent.id === msg.author.id)
      return msg.reply('You may not fight yourself.');

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

      await msg.send('Get Ready...');
      await delay(randomRange(1000, 30000));
      const word = this.words[Math.floor(Math.random() * this.words.length)];
      await msg.send(`TYPE \`${word.toUpperCase()}\` NOW!`);
      const filter = res =>
        [opponent.id, msg.author.id].includes(res.author.id) &&
        res.content.toLowerCase() === word;
      const winner = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
      });
      await redisClient.hdelAsync('active_games', msg.channel.id);
      if (!winner.size) return msg.send('Oh... No one won.');
      return msg.send(`The winner is ${winner.first().author}!`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }
***REMOVED***
