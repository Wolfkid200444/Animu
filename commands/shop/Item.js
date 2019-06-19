//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { getItemEmbed } = require('../../helpers/items');

//Init
const Item = mongoose.model('Item');

//Main
module.exports = class ItemCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'item',
      aliases: [],
      group: 'shop',
      memberName: 'item',
      throttling: {
        usages: 1,
        duration: 30
      },
      description: 'View Item',
      details: 'Use this command to view details about an item',
      examples: ['item', 'item "Marriage Ring"'],
      args: [
        {
          key: 'itemName',
          prompt: 'Name of item that you wish to view?',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { itemName }) {
    const item = await Item.findOne({ name: itemName }).exec();

    if (!item)
      return msg.embed(
        new RichEmbed()
          .setTitle('Invalid Item Name')
          .setDescription('The item with given name was not found')
          .setColor('#f44336')
      );

    return msg.embed(getItemEmbed(item));
  }
***REMOVED***
