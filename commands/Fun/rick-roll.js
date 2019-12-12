const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Never gonna give you up!',
    });
  }

  async run(msg) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle('Wanna Rick Roll Someone?')
        .setDescription(
          "Send this text to anyone you wanna rick roll (Don't forget <>):\n`<http://bit.do/fgtBc>`"
        )
        .setColor(0x2196f3)
    );
  }
***REMOVED***
