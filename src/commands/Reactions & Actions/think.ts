import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['thinking'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Thonking?',
    });
  }

  async run(msg: KlasaMessage) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} is thinking intensely.`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/3f6b06cb30758a840c59d54e2c4f95e2/tenor.gif',
  'https://media.tenor.com/images/2a2dd2fb41759ca78842646559afdc51/tenor.gif',
  'https://media.tenor.com/images/e0ce990bd8c24685ed03ce71f3e7db14/tenor.gif',
  'https://media.tenor.com/images/9fb68f77eb302937b4fc5d88999a1221/tenor.gif',
  'https://media.tenor.com/images/61331615ea27217ff9b6261ef4f45f12/tenor.gif',
  'https://media.tenor.com/images/2ab5635c3ca5d3c2891666347e44e587/tenor.gif',
];
