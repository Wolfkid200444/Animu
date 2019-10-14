const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['random-command'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Suggest a random command for you to try',
    });
  }

  async run(msg) {
    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`Try this Command`)
        .setDescription(
          `${msg.guild.settings.prefix}${this.client.commands.random().name}`,
        )
        .setColor('#2196f3'),
    );
  }
***REMOVED***
