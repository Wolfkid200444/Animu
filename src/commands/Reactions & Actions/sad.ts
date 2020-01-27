import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Feeling sad?',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is sad...`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/759a77b6345149e50b0a1d321d6c47d1/tenor.gif',
  'https://media.tenor.com/images/21e7d9c321eb6035518ad1612d11730a/tenor.gif',
  'https://media.tenor.com/images/b32248553d620e04fddb85b80b8285b9/tenor.gif',
  'https://media.tenor.com/images/04b8815d4a06405bad1ae801c013a999/tenor.gif',
  'https://media.tenor.com/images/d829a130a9242b8a9c49f0774016246d/tenor.gif',
  'https://media.tenor.com/images/290d78917d434abd580cc8036d45a437/tenor.gif',
  'https://media1.tenor.com/images/9e49b5a5f97d1a91733f38404eff8303/tenor.gif',
];
