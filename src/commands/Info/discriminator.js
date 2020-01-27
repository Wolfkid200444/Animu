const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['discrim', 'search-discriminator', 'search-discrim'],
      requiredPermissions: ['EMBED_LINKS'],
      description: 'Search for other users with a certain discriminator',
      cooldown: 10,
      usage: '[discrim:string]',
    });
  }

  async run(msg, [discrim = msg.author.discriminator]) {
    if (!/^[0-9]+$/.test(discrim) && discrim.length !== 4)
      return msg.send(
        new MessageEmbed({
          title: 'Invalid Discriminator',
          color: 0xf44336,
        }),
      );

    const users = this.client.users
      .filter((user) => user.discriminator === discrim)
      .map((user) => user.username);

    return msg.send(
      new MessageEmbed({
        title: `Found ${users.length} user with ${discrim} discriminator`,
        description: trimArray(users, 50).join(', '),
        color: 0x2196f3,
      }),
    );
  }
};
