const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { numberWithCommas } = require('../../util/util');

//Init
const Item = mongoose.model('Item');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 30,
      description: 'View Shop',
      extendedHelp: 'View all the items available for purhcase',
      usageDelim: '',
      quotedStringSupport: true,
    });
  }

  async run(msg) {
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
        }% off)`;

      itemStr += `• ${item.name} | ${priceStr}\n`;
    });

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle('Shop')
        .setDescription(itemStr)
        .setColor('#2196f3')
    );
  }
};
