const { Command } = require('klasa');
const { shuffle, verify } = require('../../util/util');
const { stripIndents, oneLine } = require('common-tags');
const axios = require('axios');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['trivia-duel'],
      cooldown: 60,
      description: 'Answer a series of quiz questions against an opponent',
      usage: '<opponent:user> [maxPts:int{1,10}]',
      usageDelim: ' ',
    });
    this.choices = ['A', 'B', 'C', 'D'];
  }

  async run(msg, [opponent, maxPts = 7]) {
    if (opponent.bot) return msg.reply('Bots may not be played against.');
    if (opponent.id === msg.author.id)
      return msg.reply('You may not play against yourself.');

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
      await msg.send(`${opponent}, do you accept this challenge?`);
      const verification = await verify(msg.channel, opponent);
      if (!verification) {
        await redisClient.hdelAsync('active_games', msg.channel.id);
        return msg.send('Looks like they declined...');
      }
      let winner = null;
      let userPoints = 0;
      let oppoPoints = 0;
      while (!winner) {
        const question = await this.fetchQuestion();
        await msg.send(stripIndents`
					**You have 15 seconds to answer this question.**
					${question.question}
					${question.answers
            .map((answer, i) => `**${this.choices[i]}.** ${answer}`)
            .join('\n')}
				`);
        const answered = [];
        const filter = (res) => {
          const choice = res.content.toUpperCase();
          if (
            !this.choices.includes(choice) ||
            answered.includes(res.author.id)
          )
            return false;
          if (![msg.author.id, opponent.id].includes(res.author.id))
            return false;
          answered.push(res.author.id);
          if (
            question.answers[
              this.choices.indexOf(res.content.toUpperCase())
            ] !== question.correct
          ) {
            msg.send(`${res.author}, that's incorrect!`).catch(() => null);
            return false;
          }
          return true;
        ***REMOVED***
        const msgs = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: 15000,
        });
        if (!msgs.size) {
          await msg.send(`Sorry, time is up! It was ${question.correct}.`);
          continue;
        }
        const result = msgs.first();
        const userWin = result.author.id === msg.author.id;
        if (userWin) ++userPoints;
        else ++oppoPoints;
        if (userPoints >= maxPts) winner = msg.author;
        else if (oppoPoints >= maxPts) winner = opponent;
        const score = oneLine`
					${userWin ? '**' : ''}${userPoints}${userWin ? '**' : ''} -
					${userWin ? '' : '**'}${oppoPoints}${userWin ? '' : '**'}
				`;
        await msg.send(
          `Nice one, ${result.author}! The score is now ${score}!`,
        );
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      if (!winner) return msg.send('Aww, no one won...');
      return msg.send(`Congrats, ${winner}, you won!`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`,
      );
    }
  }

  async fetchQuestion() {
    const { data: body } = await axios.get('https://opentdb.com/api.php', {
      params: {
        amount: 1,
        type: 'multiple',
        encode: 'url3986',
      },
    });
    if (!body.results) return this.fetchQuestion();
    const question = body.results[0];
    const answers = question.incorrect_answers.map((answer) =>
      decodeURIComponent(answer.toLowerCase()),
    );
    const correct = decodeURIComponent(question.correct_answer.toLowerCase());
    answers.push(correct);
    const shuffled = shuffle(answers);
    return {
      question: decodeURIComponent(question.question),
      answers: shuffled,
      correct,
    ***REMOVED***
  }
***REMOVED***
