const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Pet = mongoose.model('Pet');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['changepetname', 'updatepetname'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 120,
      description: 'Change name of your pet',
      extendedHelp: 'Change name of your pet',
      usage: '<name:...string{1,15}>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [name]) {
    const pet = await Pet.findOne({ memberID: msg.author.id }).exec();

    if (!pet)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle(`Oooops!`)
          .setDescription("You don't own a pet")
          .setColor('#f44336'),
      );

    pet.petName = name;

    await pet.save();

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`Changed name`)
        .setDescription(`Your pet's new name is ${name}`)
        .setColor('#2196f3'),
    );
  }
};
