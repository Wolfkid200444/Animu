const { Command } = require('klasa');
const { stripIndents } = require('common-tags');
const { shuffle } = require('../../util/util');
const {
  questions,
  houses,
  descriptions,
} = require('../../../assets/json/sorting-hat');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['sorting-hat-quiz', 'hogwarts', 'hogwarts-house'],
      cooldown: 60,
      description: 'Take a quiz to determine your Hogwarts house',
    });
    this.choices = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
    ];
  }

  async run(msg) {
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
      const points = {
        g: 0,
        s: 0,
        h: 0,
        r: 0,
      };
      const blacklist = [];
      const questionNums = ['2', '3', '4', '5', '6', '7'];
      let turn = 1;
      while (turn < 9) {
        let question;
        if (turn === 1) {
          question =
            questions.first[Math.floor(Math.random() * questions.first.length)];
        } else if (turn === 8) {
          question =
            questions.last[Math.floor(Math.random() * questions.last.length)];
        } else {
          const possible = questionNums.filter(num => !blacklist.includes(num));
          const value = possible[Math.floor(Math.random() * possible.length)];
          const group = questions[value];
          blacklist.push(value);
          question = group[Math.floor(Math.random() * group.length)];
        }
        const answers = shuffle(question.answers);
        await msg.send(stripIndents`
					**${turn}.** ${question.text}
					${answers
            .map((answer, i) => `- **${this.choices[i]}.** ${answer.text}`)
            .join('\n')}
				`);
        const filter = res =>
          res.author.id === msg.author.id &&
          this.choices
            .slice(0, answers.length)
            .includes(res.content.toUpperCase());
        const choice = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: 120000,
        });
        if (!choice.size) {
          await redisClient.hdelAsync('active_games', msg.channel.id);
          return msg.send('Oh no, you ran out of time! Too bad.');
        }
        const answer =
          answers[this.choices.indexOf(choice.first().content.toUpperCase())];
        for (const [house, amount] of Object.entries(answer.points))
          points[house] += amount;
        ++turn;
      }
      const houseResult = Object.keys(points)
        .filter(h => points[h] > 0)
        .sort((a, b) => points[b] - points[a]);
      await redisClient.hdelAsync('active_games', msg.channel.id);
      const totalPoints = houseResult.reduce((a, b) => a + points[b], 0);
      return msg.send(stripIndents`
				You are a member of... **${houses[houseResult[0]]}**!
				_${descriptions[houseResult[0]]}_
				${houseResult
          .map(
            house =>
              `${houses[house]}: ${Math.round(
                (points[house] / totalPoints) * 100
              )}%`
          )
          .join('\n')}
			`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }
};
