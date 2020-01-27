import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['laughing'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'MWAHAHAHAHA',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is laughing like a madman`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.giphy.com/media/v60KQg3MXLwTS/giphy.gif',
  'https://media.tenor.com/images/ee2e71fbef463225d4cd78f617a32c62/tenor.gif',
  'https://media.tenor.com/images/ac3a484027a3d7f503b422da7c2bddea/tenor.gif',
  'https://media.tenor.com/images/0953b631d73358ecbc4d1fb2de8770a9/tenor.gif',
  'https://media.tenor.com/images/0210abbdcc537e695b5c8ceda1b765fe/tenor.gif',
  'https://media.tenor.com/images/c51781cb6033e71ab510bb989bda878f/tenor.gif',
  'https://media.tenor.com/images/87aed095781f7fd1c1e1657cb72baa48/tenor.gif',
];
