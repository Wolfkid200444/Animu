import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['dabbing'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Wanna dab?',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} dabs!`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/b970c2aa0bbe507d05bb627e3d31b186/tenor.gif',
  'https://media.tenor.com/images/dece1e14366abd797a6f3183f77fc82e/tenor.gif',
  'https://media.tenor.com/images/64586f9db56c4af9a907c91448904d71/tenor.gif',
  'https://media.tenor.com/images/f29331e4557e2deaf14817d6fc230251/tenor.gif',
  'https://media.tenor.com/images/d68b5deb35e8c7ffad2efd182e0d4122/tenor.gif',
];
