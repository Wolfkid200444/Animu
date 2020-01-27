import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed, GuildMember } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Slap em!',
      usage: '<member:member>',
    });
  }

  async run(msg: KlasaMessage, [member]: [GuildMember]) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} slapped ${member.displayName}`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/e54a6b018678de83d8b904da4f2523dd/tenor.gif',
  'https://media.tenor.com/images/06eb4be8d2c175f1f9ef54948c50a1b8/tenor.gif',
  'https://media.tenor.com/images/33b12dd1e446d05936d0ee37ffa82b39/tenor.gif',
  'https://media.tenor.com/images/a8b185d3e87d7678cee7bcddbbfb0c75/tenor.gif',
  'https://media.tenor.com/images/c6be94676e2433321ca91e558316d973/tenor.gif',
  'https://media.tenor.com/images/f8f050aa79f92f3e45669ef8db45ed1e/tenor.gif',
];
