const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Pet = mongoose.model('Pet');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      aliases: ['petplay'],
      cooldown: 60 * 30,
      description: 'Play with your pet',
    });
  }

  async run(msg) {
    const pet = await Pet.findOne({ memberID: msg.author.id }).exec();

    if (!pet)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle(`Oooops!`)
          .setDescription("You don't own a pet")
          .setColor('#f44336')
      );

    const happiness = 2;

    await pet.petHappy(happiness);

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`You played with ${pet.petName}`)
        .setDescription(`${pet.petName}'s happiness increased by ${happiness}`)
        .setColor('#2196f3')
    );
  }
};
