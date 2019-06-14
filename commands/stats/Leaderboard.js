//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');
const Inventory = mongoose.model('Inventory');

//Main
module.exports = class LeaderboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: [],
      group: 'stats',
      memberName: 'leaderboard',
      throttling: {
        usages: 1,
        duration: 30
      },
      guildOnly: true,
      description: 'View leaderboards',
      examples: ['leaderboard'],
      args: [
        {
          key: 'type',
          prompt: 'Which leaderboard do you want to view?',
          type: 'string',
          oneOf: ['coins', 'reputation']
        }
      ]
    });
  }

  async run(msg, { type }) {
    if (type === 'coins') {
      const inventories = await Inventory.find({})
        .sort({ coins: -1 })
        .exec();
      const top = inventories
        .filter(inventory => msg.guild.members.get(inventory.memberID))
        .filter(inventory => {
          const mod = msg.guild.roles.find(r => r.name === 'Moderator');
          const seniorMod = msg.guild.roles.find(
            r => r.name === 'Senior Moderator'
          );
          const serverAdmin = msg.guild.roles.find(
            r => r.name === '👑 Server Admin 👑'
          );

          if (msg.guild.members.get(inventory.memberID).roles.has(mod.id))
            return false;
          if (msg.guild.members.get(inventory.memberID).roles.has(seniorMod.id))
            return false;
          if (
            msg.guild.members.get(inventory.memberID).roles.has(serverAdmin.id)
          )
            return false;
          else return true;
        })
        .slice(0, 10);

      let str = '';

      top.forEach((inv, i) => {
        str += `${i === 0 ? '**' : ''}${i + 1}) ${
          msg.guild.members.get(inv.memberID).displayName
        } - ${inv.coins} Coins ${i === 0 ? '👑' : ''}${i === 0 ? '**' : ''}\n`;
      });

      msg.embed(
        new RichEmbed()
          .setTitle('Top 10 Richest members of Aldovia')
          .setDescription(str)
          .setColor('#2196f3')
      );
    } else if (type === 'reputation') {
      const profiles = await Profile.find({})
        .sort({ reputation: -1 })
        .exec();
      const top = profiles
        .filter(profile => msg.guild.members.get(profile.memberID))
        .filter(profile => {
          const mod = msg.guild.roles.find(r => r.name === 'Moderator');
          const seniorMod = msg.guild.roles.find(
            r => r.name === 'Senior Moderator'
          );
          const serverAdmin = msg.guild.roles.find(
            r => r.name === '👑 Server Admin 👑'
          );

          if (msg.guild.members.get(profile.memberID).roles.has(mod.id))
            return false;
          if (msg.guild.members.get(profile.memberID).roles.has(seniorMod.id))
            return false;
          if (msg.guild.members.get(profile.memberID).roles.has(serverAdmin.id))
            return false;
          else return true;
        })
        .slice(0, 10);

      let str = '';

      top.forEach((profile, i) => {
        str += `${i === 0 ? '**' : ''}${i + 1}) ${
          msg.guild.members.get(profile.memberID).displayName
        } - ${profile.reputation}% Reputation ${i === 0 ? '👑' : ''}${
          i === 0 ? '**' : ''
        }\n`;
      });

      msg.embed(
        new RichEmbed()
          .setTitle('Top 10 Reputable members of Aldovia')
          .setDescription(str)
          .setColor('#2196f3')
      );
    }
  }
***REMOVED***
