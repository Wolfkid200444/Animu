const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['userid', 'user-id', 'member-id', 'memberid'],
      description: 'Get ID of a user',
      cooldown: 10,
      usage: '[user:user]',
    });
  }

  async run(msg, [user = msg.author]) {
    return msg.send(
      new MessageEmbed({
        title: `${user.username}'s ID`,
        description: user.id,
        color: 0x2196f3,
      }),
    );
  }
***REMOVED***
