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
      description: 'Pat some lolis',
      usage: '<member:member>',
    });
  }

  async run(msg: KlasaMessage, [member]: [GuildMember]) {
    const res = await prompt.reaction(msg.channel, {
      question: `${member}, do you want to allow ${msg.member.displayName} to pat you?`,
      userId: member.id,
      timeout: 60000,
    });

    if (!res || res === 'no')
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Ooops')
          .setDescription(
            `${msg.member}, ${member.displayName} denied your request to pat them...`
          )
          .setColor('#2196f3')
      );

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} patted ${member.displayName}`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/95f03c093cdfcbbdcbd3f9f0682cde27/tenor.gif',
  'https://media.tenor.com/images/7bf82c64188c5329fcf131e4a5e820ae/tenor.gif',
  'https://media.tenor.com/images/fa9ad7f4ecfad744aec37241cce2cecc/tenor.gif',
  'https://media.tenor.com/images/e9077e6df1177518113657639944f462/tenor.gif',
  'https://media.tenor.com/images/9e99acc64cfa233e7754d3f3dd807afc/tenor.gif',
  'https://media.tenor.com/images/ccdf9101237386ed2f5b5f357a5a5481/tenor.gif',
  'https://cdn.discordapp.com/attachments/620742938045186048/622505097141682186/image0.gif',
  'https://cdn.discordapp.com/attachments/620742938045186048/622505568136986624/image0.gif',
  'https://cdn.discordapp.com/attachments/620742938045186048/622505776434380830/image0.gif',
  'https://cdn.discordapp.com/attachments/642360052086210570/694375429603196949/38de9d5_1.gif',
  'https://cdn.discordapp.com/attachments/642360052086210570/694375430626607184/b4f8442_1_1.gif',
];
