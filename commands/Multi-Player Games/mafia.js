const { MessageEmbed } = require('discord.js');
const { Command } = require('klasa');
const prompt = require('discordjs-prompter');
const Game = require('../../util/mafia/Game');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 60,
      description: 'Play a game of Mafia',
    });
    this.storyCount = 21;
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

    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel)
      return msg.reply('You must be in a voice channel to start a game.');

    const player = this.client.lVoice.queues.get(msg.guild.id).player;

    if (
      player.status === 1 && // Playing
      player.status === 2 && // Paused
      player.status === 4 && // Errored
      player.status === 5 // Stuck
    )
      return msg.send(
        new MessageEmbed({
          title: 'Music being played',
          description:
            'It seems Music is being played currently, thus Mafia is unavailable',
          color: 0x2196f3,
        })
      );

    for (const member of voiceChannel.members.values())
      await msg.guild.members.fetch(member.id);

    if (voiceChannel.members.size > 15)
      return msg.reply('Please do not have more than 15 players.');

    if (voiceChannel.members.size < 6)
      return msg.reply('Please have at least 5 players before starting.');

    const game = new Game(this.client, msg.channel, voiceChannel);

    await redisClient.hsetAsync('active_games', msg.channel.id, this.name);
    await redisClient.saddAsync('mafia_games', msg.guild.id);
    try {
      await game.init();
      await game.generate(
        voiceChannel.members.filter(m => !m.user.bot).map(m => m.user)
      );
      await game.playAudio('init');
      await game.playAudio('rule-ask');
      const rules =
        (await prompt.reaction(msg.channel, {
          question: `Do you wish to hear a rule explanation?`,
          userId: msg.author.id,
          timeout: 30000,
        })) === 'yes'
          ? true
          : false;

      if (rules) await game.playAudio('rules');
      while (!game.shouldEnd) {
        let killed = null;
        await game.playAudio(`night-${game.turn}`);
        await game.playAudio('mafia');
        const mafia = game.players.filter(p => p.role === 'mafia');
        const choices = await Promise.all(
          mafia.map(player => player.dmRound())
        );
        const randomizer = choices.filter(c => c !== null);
        if (randomizer.length)
          killed = game.players.get(
            randomizer[Math.floor(Math.random() * randomizer.length)]
          );
        await game.playAudio('mafia-decision-made');
        const detective = game.players.find(p => p.role === 'detective');
        if (detective) {
          await game.playAudio('detective');
          await detective.dmRound();
          await game.playAudio('detective-decision-made');
        }
        await game.playAudio(`day-${game.turn}`);
        if (killed) {
          const story = Math.floor(Math.random() * this.storyCount) + 1;
          await game.playAudio(`story-${story}`);
          await game.playAudio('reveal-deceased');
          console.log('Message:', msg);
          await msg.channel.send(`Deceased: **${killed}**`);
          game.players.delete(killed.id);
        } else {
          await game.playAudio('no-deceased');
        }
        await game.playAudio('vote');
        const playersArr = Array.from(game.players.values());
        const votes = await game.getVotes(playersArr);
        if (!votes) {
          await game.playAudio('no-votes');
          continue;
        }
        const hanged = game.getHanged(votes, playersArr);
        console.log('Hanged:', hanged);
        await game.playAudio('hanged');
        await msg.channel.send(`Hanged: **${hanged.user}**`);
        game.players.delete(hanged.id);
        ++game.turn;
      }
      const mafia = game.players.find(p => p.role === 'mafia');
      if (mafia) await game.playAudio('mafia-wins');
      else await game.playAudio('mafia-loses');
      await game.playAudio('credits');
      game.end();
      return null;
    } catch (err) {
      game.end();
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
