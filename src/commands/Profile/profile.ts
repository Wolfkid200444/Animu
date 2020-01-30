import { Command, CommandStore, KlasaMessage } from 'klasa';

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['p', 'member'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View profile',
      extendedHelp:
        'View your own profile or mention someone to view their profile',
      usage: '[member:user]',
    });
  }

  async run(msg: KlasaMessage, [member = msg.author]) {
    return msg.sendEmbed(await member.getProfileEmbed(msg.guild.id));
  }
};
