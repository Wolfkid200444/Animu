import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Feeling embarrased?',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is feeling slightly embarassed...`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/8380468288417d6c51833b48390e0585/tenor.gif',
  'https://media.tenor.com/images/d8432cf1b8c90e2b791c4cc206062596/tenor.gif',
  'https://media.tenor.com/images/9ee03c5f29aa8ee30dfbf95dea30d1d0/tenor.gif',
  'https://media.tenor.com/images/3c0e60ebe6f605f64de9584188498965/tenor.gif',
  'https://media.tenor.com/images/b8779fa8efceecd4ef5c5a0b9179890a/tenor.gif',
];
