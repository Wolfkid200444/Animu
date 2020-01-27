import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text', 'dm'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 60,
      description: 'Register profile',
      extendedHelp: 'Register your profile',
    });
  }

  async run(msg: KlasaMessage) {
    const res = await msg.author.register();

    if (!res)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Profile already exists')
          .setDescription(
            'Your profile already exists, use `profile` command to view your profile'
          )
          .setColor('#f44336')
      );

    msg.sendEmbed(await msg.author.getProfileEmbed(msg.guild.id));
  }
};
