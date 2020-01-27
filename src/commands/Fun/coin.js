const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['coinflip', 'flipcoin'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Is it heads or tails?',
    });
  }

  async run(msg) {
    const side = _.sample(['Heads', 'Tails']);
    return msg.send(
      new MessageEmbed({
        title: `${msg.author.username} flipped a coin`,
        description: `Coin landed on ... **${side}**`,
        color: 0x2196f3,
      })
    );
  }
};
