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
      aliases: ['petinfo'],
      cooldown: 30,
      description: 'View info about your pet',
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

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${pet.petType === 'cat' ? '🐱' : '🐶'} ${pet.petName}`)
        .setDescription(
          pet.petUnhappyForHours > 0
            ? `${pet.petName} is unhappy for past ${pet.petUnhappyForHours} hours`
            : pet.hunger >= 50
            ? `${pet.petName} is quite hungry`
            : `${pet.petName} seems pretty happy`
        )
        .addField('❯ Hunger', `${pet.hunger}%`, true)
        .addField(
          '❯ Happiness',
          `${pet.happiness}% ${
            pet.happinessCap < 100 ? `(Capped at ${pet.happinessCap})` : ''
          }`,
          true
        )
        .addField('❯ Age', pet.age)
        .addField('❯ Toys', pet.toys.join(', '))
        .setColor('#2196f3')
    );
  }
***REMOVED***
