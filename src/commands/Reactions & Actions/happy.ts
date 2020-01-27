import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['a'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Feeling happy?',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is happy!`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media1.tenor.com/images/89289af19b7dab4e21f28f03ec0faaff/tenor.gif',
  'https://media1.tenor.com/images/203ee66b44de45f6119a9984de37b4e1/tenor.gif',
];
