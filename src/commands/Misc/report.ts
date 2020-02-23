import { Command, CommandStore, KlasaMessage } from 'klasa';
import { model } from 'mongoose';
import { INotificationModel } from '../../models/Notification';
import { MessageEmbed } from 'discord.js';

const Notification = <INotificationModel>model('Notification');

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['dm'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 60,
      description: 'Report a member',
      usageDelim: ' ',
      usage: '<guildID:string> <memberID:string> <description:string{1,500}>',
    });
  }

  async run(
    msg: KlasaMessage,
    [guildID, memberID, description]: [string, string, string]
  ) {
    const guild = this.client.guilds.get(guildID);

    if (!guild) return msg.send('No Guild with that ID was found');

    const member = guild.members.get(memberID);

    if (!member) return msg.send('No member with that ID was found');

    const notification = await new Notification({
      guildID: guild.id,
      title: `${msg.author.username} has reported ${member.user.username}`,
      description: `A member from your server by the tag of ${msg.author.tag} has reported another member with tag of ${member.user.tag} for following reason:\n\`${description}\``,
      type: 'report',
    }).save();

    if (guild.settings.get('notifications.report')) {
      guild.owner.send(
        new MessageEmbed({
          title: notification.title,
          description: notification.description,
          color: 0x2196f3,
        }).setTimestamp()
      );
    }
  }
};
