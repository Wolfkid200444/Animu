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
      description: 'No homo',
      usage: '<member:member>',
    });
  }

  async run(msg: KlasaMessage, [member]: [GuildMember]) {
    const res = await prompt.reaction(msg.channel, {
      question: `${member}, do you want to allow ${msg.member.displayName} to kiss you?`,
      userId: member.id,
      timeout: 60000,
    });

    if (!res || res === 'no')
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Ooops')
          .setDescription(
            `${msg.member}, ${member.displayName} denied your request to kiss them...`
          )
          .setColor('#2196f3')
      );

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} kissed ${member.displayName}`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/37c35cf5c3c72f34881d1ed546f70439/tenor.gif',
  'https://media.tenor.com/images/e11e607335c7e9e265d4dbbdbb2bfdf5/tenor.gif',
  'https://media.tenor.com/images/ae05156dabb6110e8262c2a36f9a54e9/tenor.gif',
  'https://media.tenor.com/images/7516f3c8e67eab088cfe38e95d91b687/tenor.gif',
  'https://media.tenor.com/images/b9b30a58c8f4e8e029c0de8da1ea007e/tenor.gif',
  'https://media.tenor.com/images/fa47bbfd4cd00807a347d678d617f8d8/tenor.gif',
  'https://media.tenor.com/images/2202827ba0db35274ead071c5a9d2553/tenor.gif',
];
