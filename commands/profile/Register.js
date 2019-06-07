//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');

//Main
module.exports = class RegisterCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'register',
      aliases: [],
      group: 'profile',
      memberName: 'register',
      throttling: {
        usages: 1,
        duration: 60
      },
      description: 'Register your profile',
      examples: ['register']
    });
  }

  async run(msg) {
    const profile = await Profile.register(msg.author.id);
    if (profile.res === 'already_exists')
      return msg.embed(
        new RichEmbed()
          .setTitle('Profile Already exists')
          .setDescription('Your profile already exists')
          .setColor('#f44336')
      );

    return msg.embed(
      new RichEmbed()
        .setTitle('Profile Registered')
        .setDescription(
          'Your profile is successfully registered, use `profile` command to view your profile'
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
