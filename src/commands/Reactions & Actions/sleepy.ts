import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Feeling... sle..pyy?.',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is slee..pyy...`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/34c6fdf206882d81d4fb0d6133f7f03f/tenor.gif',
  'https://media.tenor.com/images/5773bf6468e5d1989ea18263fe48036a/tenor.gif',
  'https://media.tenor.com/images/dbb69bf33b1971217ff2d8a8ae3a3097/tenor.gif',
  'https://tenor.com/view/sleepy-sleep-kirby-gif-13793622',
];
