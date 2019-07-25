const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const prompt = require('discordjs-prompter');

//Init
const Pet = mongoose.model('Pet');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['removepet'],
      cooldown: 120,
      description: 'Kick your pet',
      extendedHelp: 'Kick your pet out of your home (how cruel...)'
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

    const res = await prompt.reaction(msg.channel, {
      question: `Are you sure you want to kick ${pet.petName}?`,
      userId: msg.author.id
    });

    if (res !== 'yes') return;

    await Pet.deleteOne({ memberID: msg.author.id }).exec();

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`Kicked Pet...`)
        .setDescription(`You kicked your pet out of your home`)
        .setColor('#2196f3')
    );
  }
***REMOVED***
