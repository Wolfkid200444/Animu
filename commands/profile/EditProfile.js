//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { getProfileEmbed } = require('../../helpers/profile');
const _ = require('lodash');

//Init
const Profile = mongoose.model('Profile');

//Main
module.exports = class EditProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'editprofile',
      aliases: ['profileedit'],
      group: 'profile',
      memberName: 'editprofile',
      throttling: {
        usages: 1,
        duration: 10
      },
      description: 'Edit your',
      examples: [
        'editProfile',
        'editProfile description "An otaku"',
        'editProfile profileColor #2196f3'
      ],
      args: [
        {
          key: 'field',
          prompt: 'Which field do you want to edit?',
          type: 'string',
          min: 1,
          max: 100,
          oneOf: ['description', 'profile color', 'favorite anime']
        },
        {
          key: 'value',
          prompt: 'What should be the new value for specified field?',
          type: 'string',
          min: 1,
          max: 256
        }
      ]
    });
  }

  async run(msg, { field, value }) {
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

    //Validate Specific Types
    if (field === 'profilecolor' && !value.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/i))
      return msg.embed(
        new RichEmbed()
          .setTitle('Invalid Value')
          .setDescription(
            'Please provide a hexadecimal (#FFFFFF) value for profileColor property'
          )
          .setColor('#f44336')
      );

    return msg.embed(
      getProfileEmbed(
        msg,
        await profile.edit(msg.author.id, _.camelCase(field), value)
      )
    );
  }
***REMOVED***
