const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['child'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description:
        "Get gender of your upcoming child (tho we all know you'll die a virgin)",
    });
  }

  async run(msg) {
    const gender = _.sample(['Boy', 'Girl']);
    return msg.send(
      new MessageEmbed({
        title: `${msg.author.username}'s offspring will be`,
        description: `**${gender}**`,
        color: 0x2196f3,
      })
    );
  }
};
