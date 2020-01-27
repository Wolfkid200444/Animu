const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['random-user'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Get a random target (ahem.. member)',
    });
  }

  async run(msg) {
    return msg.send(
      new MessageEmbed({
        title: `I choose...`,
        description: `**${msg.guild.members.random().displayName}**`,
        color: 0x2196f3,
      })
    );
  }
};
