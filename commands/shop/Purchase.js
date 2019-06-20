//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');
const Item = mongoose.model('Item');

//Main
module.exports = class PurchaseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purchase',
      aliases: [],
      group: 'shop',
      memberName: 'purchase',
      throttling: {
        usages: 1,
        duration: 30
      },
      description: 'Purchase an Item',
      details: 'Use this command to purchase an item',
      examples: ['purchase', 'purchase "Marriage Ring"'],
      args: [
        {
          key: 'itemName',
          prompt: 'Name of item that you wish to purchase?',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { itemName }) {
    const profile = await Profile.findOne({ memberID: msg.author.id }).exec();

    if (!profile)
      return msg.embed(
        new RichEmbed()
          .setTitle('Profile not found')
          .setDescription('Use `-register` to register your profile')
          .setColor('#f44336')
      );

    const item = await Item.findOne({ name: itemName }).exec();

    if (!item)
      return msg.embed(
        new RichEmbed()
          .setTitle('Invalid Item Name')
          .setDescription('The item with given name was not found')
          .setColor('#f44336')
      );

    const res = await item.purchase(msg, msg.author.id);

    return msg.embed(
      new RichEmbed()
        .setTitle(res.title)
        .setDescription(res.desc)
        .setColor(res.res === 'err' ? '#f44336' : '#2196f3')
    );
  }
***REMOVED***
