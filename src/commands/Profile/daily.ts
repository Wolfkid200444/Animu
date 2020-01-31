import { Command, CommandStore, KlasaMessage } from 'klasa';
import { model } from 'mongoose';
import { MessageEmbed } from 'discord.js';
import { IInventoryModel } from '../../models/Inventory';

const Inventory = <IInventoryModel>model('Inventory');

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text', 'dm'],
      aliases: ['d', 'checkin', 'work'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 120,
      description: 'Get daily coins',
    });
  }

  async run(msg: KlasaMessage) {
    const inventory = await Inventory.findOne({
      memberID: msg.author.id,
    }).exec();

    if (!inventory)
      return msg.send(
        new MessageEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "Your profile doesn't exist, use `register` command to register"
          )
          .setColor('#f44336')
      );

    if (await msg.hasAtLeastPermissionLevel(8))
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle("Can't Check In")
          .setDescription("Animu Staff can't get daily coins")
          .setColor('#f44336')
      );

    if (inventory.checkedIn)
      return msg.send(
        new MessageEmbed({
          title: 'Already Checked In Today',
          description: 'Try again tommorow',
          color: '#f44336',
        })
      );

    inventory.checkIn();

    return msg.send(
      new MessageEmbed({
        title: 'Checked In',
        description:
          'Got 15 Coins :)\n\nWant more coins? Just vote [here](https://top.gg/bot/585914522225868815) and get 15 more coins',
        color: '#2196f3',
      })
    );
  }
};
