//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { getItemEmbed } = require('../../helpers/items');

//Init
const Item = mongoose.model('Item');

//Main
module.exports = class CreateItemCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'createitem',
      aliases: [],
      group: 'advancedmod',
      userPermissions: ['MANAGE_GUILD'],
      memberName: 'createitem',
      throttling: {
        usages: 1,
        duration: 5
      },
      description: 'Create a new Item for shop',
      examples: ['createItem'],
      args: [
        {
          key: 'itemName',
          prompt: 'What do you want to name this item?',
          type: 'string',
          min: 1,
          max: 100
        },
        {
          key: 'description',
          prompt: 'Describe this item in less than 240 characters',
          type: 'string',
          min: 1,
          max: 240
        },
        {
          key: 'price',
          prompt: 'What should be the price of this item?',
          type: 'integer'
        },
        {
          key: 'discount',
          prompt: 'Discount on this item? (in %) (0 for no discount)',
          type: 'integer'
        },
        {
          key: 'roles',
          prompt:
            'Roles that this item should provide (comma seperated list, none for no roles)',
          type: 'string'
        },
        {
          key: 'misc',
          prompt:
            'Misc stuff related to this item (comma seperated list, none for no misc)',
          type: 'string'
        },
        {
          key: 'usable',
          prompt: 'Can this item be used using `use` command?',
          type: 'boolean'
        },
        {
          key: 'instantUse',
          prompt: 'Will this item be automatically used upon purchase?',
          type: 'boolean'
        },
        {
          key: 'purchaseMsg',
          prompt: 'What should be the message upon purchasing this item?',
          type: 'string'
        },
        {
          key: 'useMsg',
          prompt: 'What should be the message after using this item?',
          type: 'string'
        }
      ]
    });
  }

  async run(
    msg,
    {
      itemName,
      description,
      price,
      discount,
      roles,
      misc,
      usable,
      instantUse,
      purchaseMsg,
      useMsg
    }
  ) {
    const item = await Item.findOne({ name: itemName }).exec();

    if (item)
      return msg.embed(
        new RichEmbed()
          .setTitle('Item already exists')
          .setDescription('The item with this name already exists')
          .setColor('#f44336')
      );

    const newItem = await Item.createItem(
      itemName,
      description,
      price,
      discount,
      roles,
      misc,
      usable,
      instantUse,
      purchaseMsg,
      useMsg
    );

    return msg.embed(getItemEmbed(newItem));
  }
***REMOVED***
