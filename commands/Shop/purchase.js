const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Item = mongoose.model('Item');
const Profile = mongoose.model('Profile');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      bucket: 3,
      cooldown: 10,
      description: 'Purchase an Item',
      extendedHelp: 'Purchase an Item',
      usage: '<itemName:string>',
      usageDelim: ' ',
      quotedStringSupport: true
    });
  }

  async run(msg, [itemName]) {
    if (await msg.hasAtLeastPermissionLevel(8))
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle("Can't purchase item")
          .setDescription("Senior moderators/Owners can't purchase items")
          .setColor('#f44336')
      );

    const profile = await Profile.findOne({ memberID: msg.author.id }).exec();

    if (!profile)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Profile not found')
          .setDescription('Use `-register` to register your profile')
          .setColor('#f44336')
      );

    const item = await Item.findOne({ name: itemName }).exec();

    if (!item)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Invalid Item Name')
          .setDescription('The item with given name was not found')
          .setColor('#f44336')
      );

    const res = await item.purchase(msg, msg.author.id);

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(res.title)
        .setDescription(res.desc)
        .setColor(res.res === 'err' ? '#f44336' : '#2196f3')
    );
  }
***REMOVED***
