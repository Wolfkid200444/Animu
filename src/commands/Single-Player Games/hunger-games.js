const { Command } = require('klasa');
const { stripIndents } = require('common-tags');
const prompt = require('discordjs-prompter');
const { shuffle } = require('../../util/util');
const events = require('../../../assets/json/hunger-games');
const _ = require('lodash');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['hunger-games-simulator', 'hunger-games-sim'],
      cooldown: 60,
      description:
        'Simulate a Hunger Games match with up to 24 tributes (comma seperated list)',
      usage: '<tributes:string>',
    });
  }

  async run(msg, [tributes]) {
    tributes = tributes.split(',').map(trib => _.capitalize(trib.trim()));

    if (tributes.length < 2)
      return msg.send(`...${tributes[0]} wins, as they were the only tribute.`);
    if (tributes.length > 24)
      return msg.reply('Please do not enter more than 24 tributes.');
    if (new Set(tributes).size !== tributes.length)
      return msg.reply('Please do not enter the same tribute twice.');

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
      let sun = true;
      let turn = 0;
      let bloodbath = true;
      const remaining = new Set(shuffle(tributes));
      while (remaining.size > 1) {
        if (!bloodbath && sun) ++turn;
        const sunEvents = bloodbath
          ? events.bloodbath
          : sun
          ? events.day
          : events.night;
        const results = [];
        const deaths = [];
        this.makeEvents(remaining, sunEvents, deaths, results);
        let text = stripIndents`
					__**${bloodbath ? 'Bloodbath' : sun ? `Day ${turn}` : `Night ${turn}`}:**__
					${results.join('\n')}
				`;
        if (deaths.length) {
          text += '\n\n';
          text += stripIndents`
						**${deaths.length} cannon shot${
            deaths.length === 1 ? '' : 's'
          } can be heard in the distance.**
						${deaths.join('\n')}
					`;
        }
        await msg.send(text);
        const verification =
          (await prompt.reaction(msg.channel, {
            question: `${msg.author}, Proceed?`,
            userId: msg.author.id,
            timeout: 30000,
          })) === 'yes'
            ? true
            : false;
        if (!verification) {
          await redisClient.hdelAsync('active_games', msg.channel.id);
          return msg.send('See you next time!');
        }
        if (!bloodbath) sun = !sun;
        if (bloodbath) bloodbath = false;
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      const remainingArr = Array.from(remaining);
      return msg.send(`And the winner is... ${remainingArr[0]}!`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }

  parseEvent(event, tributes) {
    return event
      .replace(/\(Player1\)/gi, `**${tributes[0]}**`)
      .replace(/\(Player2\)/gi, `**${tributes[1]}**`)
      .replace(/\(Player3\)/gi, `**${tributes[2]}**`)
      .replace(/\(Player4\)/gi, `**${tributes[3]}**`)
      .replace(/\(Player5\)/gi, `**${tributes[4]}**`)
      .replace(/\(Player6\)/gi, `**${tributes[5]}**`);
  }

  makeEvents(tributes, eventsArr, deaths, results) {
    const turn = new Set(tributes);
    for (const tribute of tributes) {
      if (!turn.has(tribute)) continue;
      const valid = eventsArr.filter(
        event => event.tributes <= turn.size && event.deaths < turn.size
      );
      const event = valid[Math.floor(Math.random() * valid.length)];
      turn.delete(tribute);
      if (event.tributes === 1) {
        if (event.deaths.length === 1) {
          deaths.push(tribute);
          tributes.delete(tribute);
        }
        results.push(this.parseEvent(event.text, [tribute]));
      } else {
        const current = [tribute];
        if (event.deaths.includes(1)) {
          deaths.push(tribute);
          tributes.delete(tribute);
        }
        for (let i = 2; i <= event.tributes; i++) {
          const turnArr = Array.from(turn);
          const tribu = turnArr[Math.floor(Math.random() * turnArr.length)];
          if (event.deaths.includes(i)) {
            deaths.push(tribu);
            tributes.delete(tribu);
          }
          current.push(tribu);
          turn.delete(tribu);
        }
        results.push(this.parseEvent(event.text, current));
      }
    }
  }
};
