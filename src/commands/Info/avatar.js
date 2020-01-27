const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: "Shows a user's avatar",
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      extendedHelp:
        "Mention a member to show their avatar or don't mention anyone to view your own avatar",
      usage: '[user:user]',
    });
  }

  async run(msg, [user = msg.author]) {
    const avatar = user.displayAvatarURL({ size: 512 });

    return msg.sendEmbed(
      new MessageEmbed()
        .setAuthor(user.username, avatar)
        .setImage(avatar)
        .setColor('#2196f3'),
    );
  }
};
