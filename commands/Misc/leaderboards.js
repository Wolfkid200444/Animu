const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const _ = require('lodash');

//Init
const Profile = mongoose.model('Profile');
const Inventory = mongoose.model('Inventory');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['leaderboard'],
      cooldown: 10,
      description: 'View leaderboards',
      extendedHelp:
        'View leaderboards, valid leaderboards are coins, reputation',
      usage: '<coins|reputation>',
    });
  }

  async run(msg, [leaderboard]) {
    if (leaderboard === 'coins') {
      const richest10 = await Inventory.find(
        {},
        {},
        { sort: { coins: -1 }, limit: 10 },
      );

      let str = '';

      richest10.forEach((inv, i) => {
        if (this.client.users.get(inv.memberID))
          str += `${i + 1}) ${this.client.users.get(inv.memberID).username} - ${
            inv.coins
          } Coins ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}\n\n`;
        else str += '[Can we get an F?]';
      });

      msg.sendEmbed(
        new MessageEmbed({
          title: 'Top 10 Richest People in Animu',
          description: str,
          color: '#2196f3',
        }),
      );
    }
  }
***REMOVED***
