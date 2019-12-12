const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['quantumcoin', 'q-coin'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Actually, quantum mechanics forbids this',
    });
  }

  async run(msg) {
    const side = _.sample([NaN, 0, null, undefined, '']);
    return msg.send(
      new MessageEmbed({
        title: `${msg.author.username} flipped a quantum coin`,
        description: `Quantum Coin landed on ... ${side}`,
        color: 0x2196f3,
      })
    );
  }
***REMOVED***
