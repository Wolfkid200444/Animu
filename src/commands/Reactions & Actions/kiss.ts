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
  'https://media.tenor.com/images/7516f3c8e67eab088cfe38e95d91b687/tenor.gif',
  'https://media.giphy.com/media/Z2sivLSfN8FH2/giphy.gif',
  'https://data.whicdn.com/images/328811537/original.gif',
  'https://media.giphy.com/media/BZstFqDpmEZu8/giphy.gif',
  'https://media.giphy.com/media/eYZmEp8eHiW52/giphy.gif',
  'https://media.giphy.com/media/ciNN4YNQNncbe/giphy.gif',
  'https://media.giphy.com/media/o7mFRYHK5JuUg/giphy.gif',
  'https://media.giphy.com/media/Z2sivLSfN8FH2/giphy.gif',
  'https://media.giphy.com/media/nO8kxVKdXSaek/giphy.gif',
  'https://media.giphy.com/media/Yd2NybPfpbdC0/giphy.gif',
  'https://media.giphy.com/media/d9skh5UdAxyqk/giphy.gif',
  'https://media.giphy.com/media/DuwGqdgiulKfK/giphy.gif',
  'https://media.giphy.com/media/514rRMooEn8ti/giphy.gif',
  'https://media.giphy.com/media/EVODaJHSXZGta/giphy.gif',
  'https://cdn.discordapp.com/attachments/587691022826602516/705167518033117250/kiss.gif',
  'https://cdn.discordapp.com/attachments/587691022826602516/702307779469377608/kiss.gif'
];
