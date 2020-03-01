import { CommandStore } from 'klasa';

import { Command } from 'klasa';
import { MessageEmbed, GuildMember } from 'discord.js';
import { KlasaMessage } from 'klasa';

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['rep'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      permissionLevel: 6,
      description: 'Modify reputation',
      extendedHelp: 'Modify reputation of a member',
      usage: '<member:member> <+|-> <amount:integer{1,100}> [reason:string]',
      usageDelim: ' ',
    });
  }

  async run(
    msg: KlasaMessage,
    [member, change, amount, reason]: [GuildMember, '+' | '-', number, string]
  ) {
    return msg.sendEmbed(
      (await member.user.editReputation(
        change,
        amount,
        msg.guild.id,
        msg.author,
        reason
      ))
        ? new MessageEmbed().setTitle('Reputation modified').setColor('#2196f3')
        : new MessageEmbed()
            .setTitle('Banned')
            .setDescription('User was banned for reaching 0% reputation')
            .setColor('#2196f3')
    );
  }
};
