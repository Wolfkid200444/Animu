import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Confused? Hmm',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is Confused... Hmmm`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/b0123ae80781b3ca807c8c21101415bd/tenor.gif',
  'https://media.tenor.com/images/fa93d52d6f767bbab36dc88ebe86b0fc/tenor.gif',
  'https://media.tenor.com/images/2624a3caedc909d2316f95c4dd408404/tenor.gif',
  'https://media.tenor.com/images/d0f0bc773dfc096280b6cf32ed654794/tenor.gif',
  'https://media.tenor.com/images/9a31b03fa3af17f5c4cfab4900d0b560/tenor.gif',
  'https://media.tenor.com/images/2e4c1066bcea144a5956ea4bebe0c0a2/tenor.gif',
  'https://media.tenor.com/images/a4a9612f91eb9ad482b3c71e4beb884a/tenor.gif',
  'https://media.tenor.com/images/986fb2b32dd4a757ae620f9a50d19c49/tenor.gif',
];
