import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed, GuildMember, TextChannel } from 'discord.js';
import prompt from 'discordjs-prompter';
import _ from 'lodash';

export default class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['succ'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 5,
      description: 'Suck the tiddies',
      usage: '<member:member>',
      nsfw: true,
    });
  }

  async run(msg: KlasaMessage, [member]: [GuildMember]) {
    const res = await prompt.reaction(msg.channel, {
      question: `${member}, do you want to allow ${msg.member.displayName} to suck you?`,
      userId: member.id,
      timeout: 60000,
    });

    if (!res || res === 'no')
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Ooops')
          .setDescription(
            `${msg.member}, ${member.displayName} denied your request to suck them...`
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
  'https://img2.gelbooru.com/images/f3/3b/f33b8bbd620d9951aca5cbccd33b67e8.gif',
  'https://img.xbooru.com//images/195/9ce812a94b35d82250e11743a1bb777d.gif?209855',
  'https://img.yuriplease.com/full/webp/0/nipple-sucking.962.webp',
  'https://rei.animecharactersdatabase.com/uploads/guild/gallery/19996-592815562.gif',
];
