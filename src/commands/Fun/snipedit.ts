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
      aliases: ['snipeedit', 'editsnipe'],
      requiredPermissions: ['EMBED_LINKS', 'MANAGE_WEBHOOKS'],
      cooldown: 60,
      description: 'Dig out the edited messages',
    });
  }

  async run(msg: KlasaMessage) {
    const editedMsg = await Log.findOne({
      guildID: msg.guild.id,
      event: 'messageEdit',
      'data.channelID': msg.channel.id,
    })
      .sort({ _id: -1 })
      .exec();

    if (!editedMsg)
      return msg.sendEmbed(
        new MessageEmbed({
          title: 'Oops!',
          description: 'No message was recently deleted in this channel',
          color: '#f44336',
        })
      );

    if (msg.channel instanceof TextChannel) {
      const webhook = await msg.channel.createWebhook(
        msg.guild.members.get(editedMsg.data.authorID).displayName,
        {
          avatar: this.client.users
            .get(editedMsg.data.authorID)
            .displayAvatarURL({ size: 64 }),
          reason: 'For snipedited message',
        }
      );

      await webhook.send(editedMsg.data.oldContent);
      await webhook.delete('Sent snipedited message');
    }
  }
};
