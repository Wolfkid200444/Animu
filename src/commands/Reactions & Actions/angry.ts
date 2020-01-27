import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Woah chill there',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is full of anger!`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media1.tenor.com/images/52560e044056cd971892506ce85eb987/tenor.gif',
  'https://media1.tenor.com/images/2b65ea052f46b0557213baa654a23a93/tenor.gif',
];
