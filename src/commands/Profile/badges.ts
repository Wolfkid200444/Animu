import { Command, CommandStore, KlasaMessage } from 'klasa';

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text', 'dm'],
      aliases: ['b', 'badge'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View your badges',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(await msg.author.getBadgesEmbed(msg.guild.id));
  }
};
