import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text', 'dm'],
      aliases: ['sb', 'activeBadge', 'selectBadge'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 30,
      description: 'Set a badge as active badge',
      usage: '<badge:...string>',
      quotedStringSupport: true,
    });
  }

  async run(msg: KlasaMessage, [badge]: [string]) {
    return msg.sendEmbed(
      (await msg.author.setActiveBadge(badge, msg.guild.id))
        ? new MessageEmbed().setTitle('Badge Active').setColor('#2196f3')
        : new MessageEmbed()
            .setTitle('Badge not found')
            .setDescription(
              "You don't have the badge you're trying to set as active"
            )
            .setColor('#f44336')
    );
  }
};
