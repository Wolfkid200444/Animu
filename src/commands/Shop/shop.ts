import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import mongoose from 'mongoose';
import { numberWithCommas } from '../../util/util';
import { IItemModel } from '../../models/Item';

//Init
const Item = <IItemModel>mongoose.model('Item');

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['text', 'dm'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 30,
      description: 'View Shop',
      extendedHelp: 'View all the items available for purhcase',
      usageDelim: '',
      quotedStringSupport: true,
    });
  }

  async run(msg: KlasaMessage) {
    const items = await Item.find({}).exec();

    let itemStr = '';

    if (items.length < 1) itemStr = '[No items on this page]';

    items.forEach(item => {
      if (!item.inShop) return;

      let priceStr = '';

      if (item.discount === 0)
        priceStr = `${numberWithCommas(item.price)} Coins`;
      else
        priceStr = ` ${numberWithCommas(
          item.price - item.price * (item.discount / 100)
        )} Coins ~~${numberWithCommas(item.price)} Coins~~ (${
          item.discount
        }% off) ${item.stockLeft ?? `[**${item.stockLeft}** in Stock]`}`;

      itemStr += `• ${item.name} | ${priceStr}\n`;
    });

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle('Shop')
        .setDescription(itemStr)
        .setColor('#2196f3')
    );
  }
};
