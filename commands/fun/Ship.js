//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');

//Main
module.exports = class ShipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ship',
      aliases: ['s'],
      group: 'profile',
      guildOnly: true,
      memberName: 'ship',
      throttling: {
        usages: 1,
        duration: 5
      },
      description: 'Ship different people',
      examples: ['ship', 'ship @saeba @potato'],
      args: [
        {
          key: 'member1',
          prompt: 'Who do you want to ship?',
          type: 'member'
        },
        {
          key: 'member2',
          prompt: 'Who do you want to ship them with?',
          type: 'member'
        }
      ]
    });
  }

  async run(msg, { member1, member2 }) {
    let profile = await Profile.findOne({
      memberID: member1.id
    }).exec();

    let profile2 = await Profile.findOne({
      memberID: member2.id
    }).exec();

    let randNum;

    if (!profile) profile = {***REMOVED***
    if (!profile2) profile2 = {***REMOVED***

    if (
      (profile.marriedTo || profile2.marriedTo) &&
      profile.marriedTo !== profile2.memberID
    )
      randNum = Math.floor(Math.random() * 44);
    else if (profile.marriedTo === profile2.memberID)
      randNum = Math.floor(Math.random() * 41) + 60;
    else randNum = Math.floor(Math.random() * 101);

    const embed = new RichEmbed()
      .setTitle(
        `${msg.guild.members.get(member1.id).displayName} ❤️ ${
          msg.guild.members.get(member2.id).displayName
        }`
      )
      .addField('Chances of sailing', `${randNum}%`)
      .setColor('#2196f3');

    if (randNum < 50) embed.setDescription("Seems like the ship won't last...");
    else if (randNum < 80)
      embed.setDescription('Ship seems to be sailing just fine ⛵');
    else embed.setDescription('Fuuuuuuuuuull Steeeeeam Aheeeeead 🚢');

    msg.embed(embed);
  }
***REMOVED***
