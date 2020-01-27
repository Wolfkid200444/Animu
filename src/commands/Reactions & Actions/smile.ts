import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['smiling'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: ':)',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is smiling :)`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://tenor.com/ya9o.gif',
  'https://media.tenor.com/images/dc0852212ea78cb9a68e499ded66703e/tenor.gif',
  'https://media.tenor.com/images/065f0f40897bb996ae33ded34146e005/tenor.gif',
  'https://media.tenor.com/images/079eafb79a3bb05064c72933210efc79/tenor.gif',
  'https://media.tenor.com/images/2d8020a82e36be2a73b41e1de6163b7a/tenor.gif',
  'https://media.tenor.com/images/032b3f8350205d6db41cf5d503c128ea/tenor.gif',
  'https://media.tenor.com/images/43c704640dcf573bc00e9593d6851c9a/tenor.gif',
  'https://media.tenor.com/images/40bed1774a8668b98f82aa5e2d881878/tenor.gif',
  'https://media.tenor.com/images/458b665517009ced6c429d46c0ad56ef/tenor.gif',
  'https://media.tenor.com/images/b0ad1394bf16f9efd12f3f7319167d88/tenor.gif',
  'https://media.tenor.com/images/ee8c551689ca0ad495637e35e92424b1/tenor.gif',
];
