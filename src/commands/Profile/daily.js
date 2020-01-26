const { Command } = require('klasa');
const { model } = require('mongoose');
const { MessageEmbed } = require('discord.js');

const Inventory = model('Inventory');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['d', 'checkin', 'work'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 120,
      description: 'Get daily coins',
    });
  }

  async run(msg) {
    const inventory = await Inventory.findOne({
      memberID: msg.author.id,
    }).exec();

    if (!inventory)
      return msg.send(
        new MessageEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "Your profile doesn't exist, use `register` command to register",
          )
          .setColor('#f44336'),
      );

    if (await msg.hasAtLeastPermissionLevel(8))
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle("Can't Check In")
          .setDescription("Animu Staff can't get daily coins")
          .setColor('#f44336'),
      );

    if (inventory.checkedIn)
      return msg.send(
        new MessageEmbed({
          title: 'Already Checked In Today',
          description: 'Try again tommorow',
          color: '#f44336',
        }),
      );

    inventory.checkIn();

    return msg.send(
      new MessageEmbed({
        title: 'Checked In',
        description: 'Got 30 Coins :)',
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
