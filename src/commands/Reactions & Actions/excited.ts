import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Excited?',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is excited!!`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/451ee12811e310f18ea5c26863692dd2/tenor.gif',
  'https://media.tenor.com/images/5ec5716814925e5f49ccb1ff31cf852b/tenor.gif',
  'https://media.tenor.com/images/e81c797da33a6211bfcdcb5c8c9e802b/tenor.gif',
  'https://media.tenor.com/images/22246aba2b9dd6b68815550e05b72f39/tenor.gif',
];
