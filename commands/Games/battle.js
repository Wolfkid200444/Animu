const { Command } = require('klasa');
const { randomRange, verify } = require('../../util/util');
const Battle = require('../../util/Battle');
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
        'Engage in a turn-based battle against another user or the AI',
      usage: '[opponent:user]',
    });
  }

  async run(msg, [opponent = this.client.user]) {
    if (opponent.id === msg.author.id)
      return msg.reply('You may not battle yourself.');
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
    const battle = new Battle(msg.author, opponent);
    try {
      if (!opponent.bot) {
        await msg.send(`${opponent}, do you accept this challenge?`);
        const verification = await verify(msg.channel, opponent);
        if (!verification) {
          await redisClient.hdelAsync('active_games', msg.channel.id);
          return msg.send('Looks like they declined...');
        }
      }
      while (!battle.winner) {
        const choice = await battle.attacker.chooseAction(msg);
        if (choice === 'attack') {
          const damage = randomRange(
            battle.defender.guard ? 5 : 20,
            battle.defender.guard ? 20 : 50,
          );
          await msg.send(`${battle.attacker} deals **${damage}** damage!`);
          battle.defender.dealDamage(damage);
          battle.reset();
        } else if (choice === 'defend') {
          await msg.send(`${battle.attacker} defends!`);
          battle.attacker.changeGuard();
          battle.reset(false);
        } else if (choice === 'special') {
          const miss = Math.floor(Math.random() * 3);
          if (miss) {
            await msg.send(`${battle.attacker}'s special attack missed!`);
          } else {
            const damage = randomRange(
              battle.defender.guard ? 50 : 100,
              battle.defender.guard ? 100 : 150,
            );
            await msg.send(`${battle.attacker} deals **${damage}** damage!`);
            battle.defender.dealDamage(damage);
          }
          battle.attacker.useMP(50);
          battle.reset();
        } else if (choice === 'cure') {
          const amount = Math.round(battle.attacker.mp / 2);
          await msg.send(`${battle.attacker} heals **${amount}** HP!`);
          battle.attacker.heal(amount);
          battle.attacker.useMP(battle.attacker.mp);
          battle.reset();
        } else if (choice === 'final') {
          await msg.send(
            `${battle.attacker} uses their final move, dealing **150** damage!`,
          );
          battle.defender.dealDamage(150);
          battle.attacker.useMP(100);
          battle.attacker.usedFinal = true;
          battle.reset();
        } else if (choice === 'run') {
          await msg.send(`${battle.attacker} flees!`);
          battle.attacker.forfeit();
        } else if (choice === 'failed:time') {
          await msg.send(`Time's up, ${battle.attacker}!`);
          battle.reset();
        } else {
          await msg.send('I do not understand what you want to do.');
        }
      }
      const { winner } = battle;
      await redisClient.hdelAsync('active_games', msg.channel.id);
      return msg.send(`The match is over! Congrats, ${winner}!`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }
***REMOVED***
