//Dependencies
import { Event } from 'klasa';
import _ from 'lodash';
import redis from 'redis';
import bluebird from 'bluebird';
import { GuildMember, TextChannel, MessageEmbed } from 'discord.js';
import { model } from 'mongoose';
import { INotificationModel } from '../models/Notification';

//Init
const Notification = <INotificationModel>model('Notification');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

module.exports = class extends Event {
  async run(member: GuildMember) {
    // Staff Member left notification
    if (
      member.hasPermission('ADMINISTRATOR') ||
      member.hasPermission('MANAGE_GUILD') ||
      member.hasPermission('BAN_MEMBERS') ||
      member.hasPermission('KICK_MEMBERS')
    ) {
      const notification = await new Notification({
        guildID: member.guild.id,
        title: `${member.displayName} just left ${member.guild.name}`,
        description: `A staff member by the tag of ${member.user.tag} just left ${member.guild.name}. Their highest role was ${member.roles.highest}.`,
        type: 'staffMemberLeft',
      }).save();

      if (member.guild.settings.get('notifications.staffMemberLeft'))
        member.guild.owner.send(
          new MessageEmbed({
            title: notification.title,
            description: notification.description,
            color: 0x2196f3,
          }).setTimestamp()
        );
    }

    if (
      _.includes(
        ['plus', 'pro'],
        await redisClient.hgetAsync('guild_tiers', member.guild.id)
      )
    ) {
      // Deleting Messages
      if (member.guild.settings.get('deleteMessagesChannels').length > 0)
        member.guild.settings
          .get('deleteMessagesChannels')
          .forEach(async (ch: string) => {
            const channel = member.guild.channels.get(ch);

            if (!(channel instanceof TextChannel)) return;

            let messages = await channel.messages.fetch({ limit: 100 });
            messages = messages.filter(msg => msg.author.id === member.id);
            channel.bulkDelete(messages);
          });
    }
  }
};
