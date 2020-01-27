import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed, GuildMember } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Gotta shoot em all',
      usage: '<member:member>',
    });
  }

  async run(msg: KlasaMessage, [member]: [GuildMember]) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} shot ${member.displayName}`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/3ef50c7fb8c9031547fcd56c8865cea6/tenor.gif',
  'https://media.tenor.com/images/08ca3720cd4acf03bb784637425bc883/tenor.gif',
  'https://media.tenor.com/images/b7c10f859dd885581585cc4489b86c1c/tenor.gif',
  'https://media.tenor.com/images/375c8fb9abe9313680cc7bbf1501698f/tenor.gif',
  'https://media.tenor.com/images/7ccf6c73e7bc936548f56ee09759aee3/tenor.gif',
  'https://media.tenor.com/images/bc493788b867de6f4d64d5742d319ce8/tenor.gif',
];
