const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Pet = mongoose.model('Pet');
const Inventory = mongoose.model('Inventory');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 120,
      description: 'Feed your pet (20 Coins)',
      extendedHelp:
        "Feed your pet, if you don't feed your pet for 24 hours, they'll end up dead",
    });
  }

  async run(msg) {
    const pet = await Pet.findOne({ memberID: msg.author.id }).exec();
    const inventory = await Inventory.findOne({
      memberID: msg.author.id,
    }).exec();

    if (!pet)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle(`Oooops!`)
          .setDescription("You don't own a pet")
          .setColor('#f44336'),
      );

    if (inventory.coins < 20)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle(`Oooops!`)
          .setDescription("You don't have 20 coins to feed your pet")
          .setColor('#f44336'),
      );

    await inventory.deductCoins(20);

    pet.lastFedHoursAgo = 0;

    await pet.save();

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`Fed Pet`)
        .setDescription(`You've fed your pet successfully`)
        .setColor('#2196f3'),
    );
  }
***REMOVED***
