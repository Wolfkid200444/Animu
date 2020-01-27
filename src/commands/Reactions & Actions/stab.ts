import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed, GuildMember } from 'discord.js';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['a'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Stab someone',
      usage: '<member:member>',
    });
  }

  async run(msg: KlasaMessage, [member]: [GuildMember]) {
    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} stabbed ${member.displayName}`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/a423ea7744002004ebb3563193104b7d/tenor.gif',
  'https://media.tenor.com/images/9cc4de64a97fc399b6126c627a57051a/tenor.gif',
  'https://media.tenor.com/images/c43af954fde3c43bd3f6837d0393507d/tenor.gif',
  'https://media.tenor.com/images/18988b9e299003cf3c42407e9dfa218b/tenor.gif',
];
