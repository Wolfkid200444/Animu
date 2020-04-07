import { CommandStore } from 'klasa';
import { KlasaMessage } from 'klasa';
import { Command } from 'klasa';
import { MessageEmbed, TextChannel } from 'discord.js';
import mongoose from 'mongoose';
import { ILogModel } from '../../models/Log';

//Init
const Log = <ILogModel>mongoose.model('Log');

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text'],
      aliases: ['snipe', 'undelete'],
      requiredPermissions: ['EMBED_LINKS', 'MANAGE_WEBHOOKS'],
      cooldown: 60,
      description: 'Dig out the deleted messages',
    });
  }

  async run(msg: KlasaMessage) {
    const deletedMsg = await Log.findOne({
      guildID: msg.guild.id,
      event: 'messageDelete',
      'data.channelID': msg.channel.id,
    })
      .sort({ _id: -1 })
      .exec();

    if (!deletedMsg)
      return msg.sendEmbed(
        new MessageEmbed({
          title: 'Oops!',
          description: 'No message was recently deleted in this channel',
          color: '#f44336',
        })
      );

    if (msg.channel instanceof TextChannel) {
      const webhook = await msg.channel.createWebhook(
        msg.guild.members.get(deletedMsg.data.authorID).displayName,
        {
          avatar: this.client.users
            .get(deletedMsg.data.authorID)
            .displayAvatarURL({ size: 64 }),
          reason: 'For sniping message',
        }
      );

      await webhook.send(deletedMsg.data.content);
      await webhook.delete('Sent sniped message');
    }
  }
};
