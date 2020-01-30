import { Command, CommandStore, KlasaMessage } from 'klasa';

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text', 'dm'],
      aliases: ['ep', 'profiledit', 'pedit', 'editp', 'edit', 'editprofile'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Edit profile',
      extendedHelp:
        "Edit your profile, valid keys are 'description', 'favorite anime' and 'profile color'",
      usage:
        '<description|favoriteAnime|profileColor|profileWallpaper> <value:...string>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg: KlasaMessage, [key, value]) {
    await msg.author.editProfile(key, value);
    return msg.sendEmbed(await msg.author.getProfileEmbed(msg.guild.id));
  }
};
