const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Fuse = require('fuse.js');

//Init
const Item = mongoose.model('Item');
const Profile = mongoose.model('Profile');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['buy'],
      requiredPermissions: ['EMBED_LINKS'],
      bucket: 3,
      cooldown: 10,
      description: 'Purchase an Item',
      extendedHelp: 'Purchase an Item',
      usage: '<itemName:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [itemName]) {
    let isStaff = false;

    if (await msg.hasAtLeastPermissionLevel(8)) isStaff = true;

    const profile = await Profile.findOne({ memberID: msg.author.id }).exec();

    if (!profile)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Profile not found')
          .setDescription('Use `-register` to register your profile')
          .setColor('#f44336')
      );

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

    if (!item.inShop)
      return msg.sendEmbed(
        new MessageEmbed({
          title: 'Item not purchasable',
          description:
            "The Item you're trying to purchase can't be purchased from shop",
          color: 0x2196f3,
        })
      );

    const res = await item.purchase(msg, msg.author.id, isStaff);

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(res.title)
        .setDescription(res.desc)
        .setColor(res.res === 'err' ? '#f44336' : '#2196f3')
    );
  }
***REMOVED***
