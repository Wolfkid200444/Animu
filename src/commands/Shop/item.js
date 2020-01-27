const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Fuse = require('fuse.js');
const { numberWithCommas } = require('../../util/util');

//Init
const Item = mongoose.model('Item');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      bucket: 2,
      cooldown: 10,
      description: 'View an Item',
      extendedHelp:
        'View details about an item such as description, pricing, etc',
      usage: '<itemName:...string>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [itemName]) {
    const itemArr = await Item.find({}).exec();

    const fuse = new Fuse(itemArr, {
      keys: ['name'],
      threshold: 0.2,
    });

    const item = fuse.search(itemName)[0];

    if (!item)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Invalid Item Name')
          .setDescription('The item with given name was not found')
          .setColor('#f44336')
      );

    let priceStr = '';

    if (item.discount === 0) priceStr = `${numberWithCommas(item.price)} Coins`;
    else
      priceStr = `${numberWithCommas(
        item.price - item.price * (item.discount / 100)
      )} ~~${numberWithCommas(item.price)}~~ (${item.discount}% off)`;

    return msg.sendEmbed(
      new MessageEmbed()
        .setThumbnail(item.imageURL)
        .addField('❯ Name', item.name)
        .addField('❯ Description', item.description)
        .addField('❯ Price', item.inShop ? priceStr : '-')
        .setColor('#2196f3')
    );
  }
};
