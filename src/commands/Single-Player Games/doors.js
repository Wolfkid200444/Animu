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
      aliases: ['door', 'door-opening', 'open-door', 'monty-hall'],
      cooldown: 10,
      description:
        'Open the right door, and you win the money! Make the wrong choice, and you get the fire!',
      usage: '<door:int{1,3}>',
    });
    this.doors = [1, 2, 3];
  }

  async run(msg, [door]) {
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
      const win = this.doors[Math.floor(Math.random() * this.doors.length)];
      const noWin = this.doors.filter(
        thisDoor => thisDoor !== win && door !== thisDoor
      )[0];
      const stick =
        (await prompt.reaction(msg.channel, {
          question: `
        ${
          msg.author
        } Well, there's nothing behind door number **${noWin}**. Do you want to stick with door ${door}?
				${this.emoji(1, noWin)} ${this.emoji(2, noWin)} ${this.emoji(3, noWin)}
        `,
          userId: msg.author.id,
          timeout: 30000,
        })) === 'yes'
          ? true
          : false;
      if (!stick)
        // eslint-disable-next-line require-atomic-updates
        door = this.doors.filter(
          thisDoor => door !== thisDoor && thisDoor !== noWin
        )[0];
      await redisClient.hdelAsync('active_games', msg.channel.id);
      return msg.reply(`
				${door === win ? 'You chose wisely.' : 'Hmm... Try again.'}
				${this.emoji(1, noWin, win, door)} ${this.emoji(
        2,
        noWin,
        win,
        door
      )} ${this.emoji(3, noWin, win, door)}
			`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }

  emoji(door, noWin, win, chosen) {
    return door === win && chosen === win
      ? '💰'
      : door === noWin
      ? '🔥'
      : door === chosen
      ? '🔥'
      : '🚪';
  }
};
