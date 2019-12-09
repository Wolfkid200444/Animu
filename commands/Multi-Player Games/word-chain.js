const { Command } = require('klasa');
const prompt = require('discordjs-prompter');
const { stripIndents } = require('common-tags');
const { delay } = require('../../util/util');
const startWords = require('../../json/words');
const { websterAPIKey } = require('../../config/keys');
const axios = require('axios');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description:
        "Try to come up with words that start with the last letter of your opponent's word",
      usage: '<opponent:user> [time:int{1,10}]',
    });
  }

  async run(msg, [opponent, time = 10]) {
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

      const startWord =
        startWords[Math.floor(Math.random() * startWords.length)];
      await msg.send(stripIndents`
				The start word will be **${startWord}**! You must answer within **${time}** seconds!
				If you think your opponent has played a word that doesn't exist, respond with **challenge** on your turn.
				Words cannot contain anything but letters. No numbers, spaces, or hyphens may be used.
				The game will start in 5 seconds...
			`);
      await delay(5000);
      let userTurn = Boolean(Math.floor(Math.random() * 2));
      const words = [];
      let winner = null;
      let lastWord = startWord;
      while (!winner) {
        const player = userTurn ? msg.author : opponent;
        const letter = lastWord.charAt(lastWord.length - 1);
        await msg.send(`It's ${player}'s turn! The letter is **${letter}**.`);
        const filter = res =>
          res.author.id === player.id &&
          /^[a-zA-Z']+$/i.test(res.content) &&
          res.content.length < 50;
        const wordChoice = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: time * 1000,
        });
        if (!wordChoice.size) {
          await msg.send('Time!');
          winner = userTurn ? opponent : msg.author;
          break;
        }
        const choice = wordChoice.first().content.toLowerCase();
        if (choice === 'challenge') {
          const checked = await this.verifyWord(lastWord);
          if (!checked) {
            await msg.send(`Caught red-handed! **${lastWord}** is not valid!`);
            winner = player;
            break;
          }
          await msg.send(`Sorry, **${lastWord}** is indeed valid!`);
          continue;
        }
        if (!choice.startsWith(letter) || words.includes(choice)) {
          await msg.send('Sorry! You lose!');
          winner = userTurn ? opponent : msg.author;
          break;
        }
        words.push(choice);
        lastWord = choice;
        userTurn = !userTurn;
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      if (!winner) return msg.send('Oh... No one won.');
      return msg.send(`The game is over! The winner is ${winner}!`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }

  async verifyWord(word) {
    try {
      const { data: body } = await axios
        .get(
          `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`
        )
        .query({ key: websterAPIKey });
      if (!body.length) return false;
      return true;
    } catch (err) {
      if (err.status === 404) return false;
      return null;
    }
  }
***REMOVED***
