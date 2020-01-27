import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['lewding'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Feeling Lewd?',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is feeling Lewd`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/6d4cfe675e7f32434676c620d29a18b3/tenor.gif',
  'https://media.tenor.com/images/6d4cfe675e7f32434676c620d29a18b3/tenor.gif',
  'https://media.tenor.com/images/aea010c50a3aab16d3a5f47f027c6890/tenor.gif',
  'https://media.tenor.com/images/a4a9612f91eb9ad482b3c71e4beb884a/tenor.gif',
  'https://media.tenor.com/images/b71ec0180c92456eba26880665ef2f9f/tenor.gif',
  'https://media.tenor.com/images/48ab2977fecc21aab78fe4985fa543c6/tenor.gif',
  'https://media.tenor.com/images/18d59a0d0f1a8549e850fcf20c39abf3/tenor.gif',
];
