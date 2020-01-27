import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed, GuildMember } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Take your anger out on someone',
      usage: '<member:member>',
    });
  }

  async run(msg: KlasaMessage, [member]: [GuildMember]) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} punched ${member.displayName}`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/eacda1982395b0cba74485b1749b9dbf/tenor.gif',
  'https://media.tenor.com/images/c652300c595c1ab99c2f6461600f27d0/tenor.gif',
  'https://media.tenor.com/images/a809af615825c8d707650678c3175eb9/tenor.gif',
  'https://media.tenor.com/images/b11c79cf158d8c9bd6e721676b06ad73/tenor.gif',
  'https://media.tenor.com/images/fd39799497e493022dd01b2cc55149ee/tenor.gif',
  'https://media.tenor.com/images/eadd2f071795558b6555edc5adf6d62d/tenor.gif',
  'https://media.tenor.com/images/e9f33925a9d24e22f5e5d6612ccf37f1/tenor.gif',
];
