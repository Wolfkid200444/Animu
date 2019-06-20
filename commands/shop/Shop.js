//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Item = mongoose.model('Item');

//Main
module.exports = class ShopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shop',
      aliases: [],
      group: 'shop',
      memberName: 'shop',
      throttling: {
        usages: 1,
        duration: 30
      },
      description: 'View Shop',
      details: 'Use this command to view shop',
      examples: ['shop']
    });
  }

  async run(msg) {
    const items = await Item.find({}).exec();

    let itemStr = '';

    items.forEach((item, i) => {
      let priceStr = '';

      if (item.discount === 0) priceStr = `${item.price} Coins`;
      else
        priceStr = ` ${item.price -
          item.price * (item.discount / 100)} Coins ~~${item.price} Coins~~ (${
          item.discount
        }% off)`;

      itemStr += `${i + 1}) ${item.name} | ${priceStr}\n`;
    });

    msg.embed(
      new RichEmbed()
        .setTitle('Shop')
        .setDescription(itemStr)
        .setColor('#2196f3')
    );
  }
***REMOVED***
