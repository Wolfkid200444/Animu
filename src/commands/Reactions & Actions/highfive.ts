import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed, GuildMember } from 'discord.js';
import prompt from 'discordjs-prompter';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Highfive someone',
      usage: '<member:member>',
    });
  }

  async run(msg: KlasaMessage, [member]: [GuildMember]) {
    const res = await prompt.reaction(msg.channel, {
      question: `${member}, ${msg.member.displayName} wants to high-five you! Will you leave them hanging?`,
      userId: member.id,
      timeout: 60000,
    });

    if (!res || res === 'no')
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Ooops')
          .setDescription(
            `${msg.member}, ${member.displayName} left you hanging...`
          )
          .setColor('#2196f3')
      );

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} high-fived ${member.displayName}`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://cdn.discordapp.com/attachments/587691022826602516/709221813414264953/Highfive3.gif',
  'https://cdn.discordapp.com/attachments/587691022826602516/709221813409808464/Highfive2.gif',
  'https://cdn.discordapp.com/attachments/587691022826602516/709221811413319700/Highfive.gif',
];
