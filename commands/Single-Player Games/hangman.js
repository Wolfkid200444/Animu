const { Command } = require('klasa');
const { stripIndents } = require('common-tags');
const words = require('../../json/words');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 60,
      description:
        'Prevent a man from being hanged by guessing a word as fast as you can',
    });
  }

  async run(msg) {
    const current = await redisClient.hexistsAsync(
      'active_games',
      msg.channel.id,
    );
    if (current) {
      const currentGame = await redisClient.hgetAsync(
        'active_games',
        msg.channel.id,
      );
      return msg.reply(
        `Please wait until the current game of \`${currentGame}\` is finished.`,
      );
    }

    await redisClient.hsetAsync('active_games', msg.channel.id, this.name);

    try {
      const word = words[
        Math.floor(Math.random() * words.length)
      ].toLowerCase();
      let points = 0;
      let displayText = null;
      let guessed = false;
      const confirmation = [];
      const incorrect = [];
      const display = new Array(word.length).fill('_');
      while (word.length !== confirmation.length && points < 6) {
        await msg.send(stripIndents`
					${displayText === null ? 'Here we go!' : displayText ? 'Good job!' : 'Nope!'}
					\`${display.join(' ')}\`. Which letter do you choose?
					Incorrect Tries: ${incorrect.join(', ') || 'None'}
					\`\`\`
					___________
					|     |
					|     ${points > 0 ? 'O' : ''}
					|    ${points > 2 ? '—' : ' '}${points > 1 ? '|' : ''}${points > 3 ? '—' : ''}
					|    ${points > 4 ? '/' : ''} ${points > 5 ? '\\' : ''}
					===========
					\`\`\`
				`);
        const filter = (res) => {
          const choice = res.content.toLowerCase();
          return (
            res.author.id === msg.author.id &&
            !confirmation.includes(choice) &&
            !incorrect.includes(choice)
          );
        ***REMOVED***
        const guess = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
        });
        if (!guess.size) {
          await msg.send('Sorry, time is up!');
          break;
        }
        const choice = guess.first().content.toLowerCase();
        if (choice === 'end') break;
        if (choice.length > 1 && choice === word) {
          guessed = true;
          break;
        } else if (word.includes(choice)) {
          displayText = true;
          for (let i = 0; i < word.length; i++) {
            if (word.charAt(i) !== choice) continue;
            confirmation.push(word.charAt(i));
            display[i] = word.charAt(i);
          }
        } else {
          displayText = false;
          if (choice.length === 1) incorrect.push(choice);
          points++;
        }
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      if (word.length === confirmation.length || guessed)
        return msg.send(`You won, it was ${word}!`);
      return msg.send(`Too bad... It was ${word}...`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`,
      );
    }
  }
***REMOVED***
