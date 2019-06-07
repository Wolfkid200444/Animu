//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const _ = require('lodash');
const { getInventoryEmbed } = require('../../helpers/inventory');

//Init
const Profile = mongoose.model('Profile');
const Inventory = mongoose.model('Inventory');

//Main
module.exports = class InventoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'inventory',
      aliases: ['i'],
      group: 'inventory',
      memberName: 'inventory',
      throttling: {
        usages: 1,
        duration: 10
      },
      description:
        "View your inventory, or append true at the end to view your partner's inventory",
      details:
        "View your or your partner's inventory. To view your partner's inventory, append 'true' at the end.\
         Use this command in DM if you wish to hide your inventory from others",
      examples: ['inventory', 'inventory true'],
      args: [
        {
          key: 'partnerInventory',
          prompt: "Do you want to view partner's Inventory?",
          type: 'boolean',
          default: false
        }
      ]
    });
  }

  async run(msg, { partnerInventory }) {
    const profile = await Profile.findOne({
      memberID: msg.author.id
    }).exec();

    if (!profile)
      return msg.embed(
        new RichEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "Your profile doesn't exist, use `register` command to register your profile"
          )
          .setColor('#f44336')
      );

    if (!profile.marriedTo && partnerInventory)
      return msg.embed(
        new RichEmbed()
          .setTitle('Not married')
          .setDescription(
            "You can't view your partner's inventory when you have no partner... You did an Ooopsie!"
          )
          .setColor('#f44336')
      );

    const inventory = await Inventory.findOne({
      memberID: partnerInventory ? profile.marriedTo : msg.author.id
    }).exec();

    msg.embed(getInventoryEmbed(msg, inventory));
  }
***REMOVED***
