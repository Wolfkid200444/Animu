//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { getProfileEmbed } = require('../../helpers/profile');

//Init
const Profile = mongoose.model('Profile');

//Main
module.exports = class ProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'profile',
      aliases: ['p'],
      group: 'profile',
      guildOnly: true,
      memberName: 'profile',
      throttling: {
        usages: 1,
        duration: 10
      },
      description: "View your profile or someone else's profile",
      examples: ['profile'],
      args: [
        {
          key: 'member',
          prompt: 'Mention a member to view their profile',
          type: 'member',
          default: ''
        }
      ]
    });
  }

  async run(msg, { member }) {
    const profile = await Profile.findOne({
      memberID: member ? member.id : msg.author.id
    }).exec();

    if (!profile)
      return msg.embed(
        new RichEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "Profile doesn't exist, use `register` command to register profile"
          )
          .setColor('#f44336')
      );

    return msg.embed(getProfileEmbed(msg, profile));
  }
***REMOVED***
