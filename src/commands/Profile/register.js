const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 60,
      description: 'Register profile',
      extendedHelp: 'Register your profile',
    });
  }

  async run(msg) {
    const res = await msg.author.register();

    if (!res)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Profile already exists')
          .setDescription(
            'Your profile already exists, use `profile` command to view your profile',
          )
          .setColor('#f44336'),
      );

    msg.sendEmbed(await msg.author.getProfileEmbed(msg.guild.id));
  }
};
