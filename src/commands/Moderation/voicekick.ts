import { CommandStore } from 'klasa';

import { Command } from 'klasa';
import { KlasaMessage } from 'klasa';
import { GuildMember } from 'discord.js';

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      permissionLevel: 6,
      requiredPermissions: ['MOVE_MEMBERS'],
      runIn: ['text'],
      description: 'Disconnect a member from voice channel',
      usage: '<member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg: KlasaMessage, [member, reason]: [GuildMember, string]) {
    if (member.id === msg.author.id) throw 'Why would you voice kick yourself?';
    if (member.id === this.client.user.id) throw 'Have I done something wrong?';
    if (!member.voice.channelID) throw 'That member is not in a voice channel.';
    if (member.roles.highest.position >= msg.member.roles.highest.position)
      throw 'You cannot voice kick this user.';

    await member.voice.setChannel(null, reason);
    return msg.send(
      `Voice kicked **${member.user.tag}**.${
        reason ? `With reason of: ${reason}` : ''
      }`
    );
  }
};
