const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Item = mongoose.model('Item');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      cooldown: 30,
      description: 'View Shop',
      extendedHelp: 'View all the items available for purhcase',
      usage: '[page:integer]',
      usageDelim: '',
      quotedStringSupport: true
    });
  }

  async run(msg, [page = 1]) {
    const items = await Item.find({})
      .skip(10 * (page - 1))
      .limit(10)
      .exec();

    let itemStr = '';

    items.forEach(item => {
      let priceStr = '';

      if (item.discount === 0) priceStr = `${item.price} Coins`;
      else
        priceStr = ` ${item.price -
          item.price * (item.discount / 100)} Coins ~~${item.price} Coins~~ (${
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
***REMOVED***
