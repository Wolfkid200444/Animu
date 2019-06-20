//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');
const prompt = require('discordjs-prompter');

//Init
const Profile = mongoose.model('Profile');
const Inventory = mongoose.model('Inventory');

//Main
module.exports = class MarryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'marry',
      aliases: [],
      group: 'profile',
      memberName: 'marry',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 60
      },
      description: 'Marry someone',
      details:
        "Use this command to marry someone, Please note that this requires a marriage ring. If the person you're trying to marry declines your request, you WILL lose you marriage ring",
      examples: ['marry', 'marry @somone'],
      args: [
        {
          key: 'member',
          prompt: 'Mention the member that you want to marry?',
          type: 'member'
        }
      ]
    });
  }

  async run(msg, { member }) {
    const profile = await Profile.findOne({
      memberID: msg.member.id
    }).exec();

    const profileToMarry = await Profile.findOne({
      memberID: member.id
    }).exec();

    if (msg.member.id === member.id)
      return msg.embed(
        new RichEmbed()
          .setTitle("Can't marry yourself")
          .setDescription('You did an oopsie!')
          .setColor('#f44336')
      );

    if (!profile)
      return msg.embed(
        new RichEmbed()
          .setTitle('Profile not found')
          .setDescription('Use `-register` to register your profile')
          .setColor('#f44336')
      );

    if (!profileToMarry)
      return msg.embed(
        new RichEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "The person you're trying to marry doesn't have a profile, they have to use `-register` command to register their profile"
          )
          .setColor('#f44336')
      );

    const inventory = await Inventory.findOne({
      memberID: msg.member.id
    }).exec();

    const index = inventory.inventory.indexOf('Marriage Ring');

    if (index < 0)
      return msg.embed(
        new RichEmbed()
          .setTitle('Marriage Ring not found')
          .setDescription(
            'You need a `Marriage Ring` in your inventory to marry someone'
          )
          .setColor('#f44336')
      );

    inventory.inventory.splice(index, 1);

    const res = await prompt.reaction(msg.channel, {
      question: `${member}, Do you accept ${
        msg.member.displayName
      }'s proposal to marry you?`,
      userId: member.id
    });

    if (!res || res === 'no')
      return msg.embed(
        new RichEmbed()
          .setTitle('Rejected')
          .setDescription(`Big Oof for you, ${msg.member.displayName}`)
          .setColor('#f44336')
      );

    profile.marriedTo = member.id;
    profileToMarry.marriedTo = msg.member.id;

    await profile.save();
    await profileToMarry.save();
    await inventory.save();

    msg.embed(
      new RichEmbed()
        .setTitle("You're married now!🎉")
        .setDescription(
          `${msg.member.displayName} married ${member.displayName} 🎉🎉🎉`
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
