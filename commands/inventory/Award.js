//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');
const Inventory = mongoose.model('Inventory');

//Main
module.exports = class AwardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'award',
      aliases: [],
      group: 'inventory',
      guildOnly: true,
      memberName: 'award',
      throttling: {
        usages: 1,
        duration: 30
      },
      description: 'Award people',
      examples: ['award', 'award @potato silver'],
      args: [
        {
          key: 'member',
          prompt: 'Who do you want to award?',
          type: 'member'
        },
        {
          key: 'award',
          prompt:
            'which award do you want to give them? (silver, gold, platinum)',
          type: 'string',
          oneOf: ['silver', 'gold', 'platinum']
        }
      ]
    });
  }

  async run(msg, { member, award }) {
    const inventory = await Inventory.findOne({ memberID: msg.member }).exec();
    const profile = await Inventory.findOne({ memberID: member.id }).exec();

    if (!inventory)
      return msg.embed(
        new RichEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "Profile doesn't exist, use `register` command to register profile"
          )
          .setColor('#f44336')
      );

    if (!profile)
      return msg.embed(
        new RichEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "The person you're trying to award doesn't have a profile, use `register` command to register profile"
          )
          .setColor('#f44336')
      );

    const cost = award === 'silver' ? 10 : award === 'gold' ? 100 : 1000;

    if (inventory.coins < cost)
      return msg.embed(
        new RichEmbed()
          .setTitle('Insufficient Coins')
          .setDescription(
            `The reward you're trying to give costs ${cost}, and it seems you don't have enough coins`
          )
          .setColor('#f44336')
      );

    profile.rewards[award] += 1;
    inventory.coins -= cost;

    await profile.save();
    await inventory.save();

    return msg.embed(
      new RichEmbed()
        .setTitle('Award rewarded')
        .setDescription(
          `${msg.member.displayName} gave a ${award} award to ${
            member.displayName
          }`
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
