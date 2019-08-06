const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 5,
      description: 'Ship 2 people',
      usage: '<member1:user> <member2:user>',
      usageDelim: ' '
    });
  }

  async run(msg, [member1, member2]) {
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
      randNum = Math.random() < 0.5 ? Math.floor(Math.random() * 41) + 60 : 69;
    else randNum = Math.floor(Math.random() * 101);

    const embed = new MessageEmbed()
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

    msg.sendEmbed(embed);
  }
***REMOVED***
