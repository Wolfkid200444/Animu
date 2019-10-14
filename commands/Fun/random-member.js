const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['random-user', 'member-roulette', 'user-roullete'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Get a random member from the server',
    });
  }

  async run(msg) {
    return msg.send(
      new MessageEmbed({
        title: `I choose...`,
        description: `**${msg.guild.members.random().displayName}**`,
        color: 0x2196f3,
      }),
    );
  }
***REMOVED***
