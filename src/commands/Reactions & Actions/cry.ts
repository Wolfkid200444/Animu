import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['crying'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Gonna cry?',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is crying :'(`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/c8f6d1972f6051cf40fec17da7b18a53/tenor.gif',
  'https://media.tenor.com/images/14faea11230861e5f61bb4d90ac9e61d/tenor.gif',
  'https://media.tenor.com/images/b1c7fc822968ee417e7b249eae255f22/tenor.gif',
  'https://media.tenor.com/images/82c7523a9b203fc4e938d2d027540dea/tenor.gif',
  'https://media.tenor.com/images/d7286a667f4c7f5e3af2daf2ac3d9948/tenor.gif',
  'https://media.tenor.com/images/8516e63ed64f255bea993cf52a80194a/tenor.gif',
  'https://media.tenor.com/images/d571f86a5adcb4545444e9d1dc4638f9/tenor.gif',
  'https://media.tenor.com/images/c012b19b561eccce7d943c5dec24a517/tenor.gif',
  'https://tenor.com/view/anime-umaru-cry-crying-tears-gif-5184314',
];
