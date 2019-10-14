const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Get opinion on something',
      usage: '<question:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [question]) {
    const opinion = _.sample(['👍', '👎']);
    return msg.send(
      new MessageEmbed({
        title: `${msg.author.username} asks **${question}**`,
        description: opinion,
        color: 0x2196f3,
      }),
    );
  }
***REMOVED***
