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
      description: 'Hug someone and make their day a little better',
      usage: '<member:member>',
    });
  }

  async run(msg: KlasaMessage, [member]: [GuildMember]) {
    const res = await prompt.reaction(msg.channel, {
      question: `${member}, do you want to allow ${msg.member.displayName} to hug you?`,
      userId: member.id,
      timeout: 60000,
    });

    if (!res || res === 'no')
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Ooops')
          .setDescription(
            `${msg.member}, ${member.displayName} denied your request to hug them...`
          )
          .setColor('#2196f3')
      );

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} hugged ${member.displayName}`)
        .setImage(_.sample(gifs))
        .setColor('#2196f3')
    );
  }
}

// Gifs
const gifs = [
  'https://media.tenor.com/images/6bff4b147f43aaaca86421cfb09c9324/tenor.gif',
  'https://media.tenor.com/images/83825008f01d38a19bf541a1a401cdfb/tenor.gif',
  'https://media.tenor.com/images/95dbbb87de1b1c65ffdcf60fae5bd3a3/tenor.gif',
  'https://media.tenor.com/images/76399596d5842b90647d5623d14931cf/tenor.gif',
  'https://media.tenor.com/images/9dca2e8ce44e49231805b0aa0f78f8a5/tenor.gif',
];
