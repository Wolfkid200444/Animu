const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const mongoose = require('mongoose');

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
      usage: '<coins|reputation>'
    });
  }

  async run(msg, [leaderboard]) {
    let profiles;

    if (leaderboard === 'coins')
      profiles = await Inventory.find({})
        .sort({ coins: -1 })
        .exec();
    else
      profiles = await Profile.find({})
        .sort({ reputation: -1 })
        .exec();

    const top10 = profiles
      .filter(profile => {
        let inLeaderboard = true;

        for (const owner of this.client.owners)
          if (owner.id === profile.memberID) inLeaderboard = false;

        if (this.client.settings.aldoviaSeniorMods.includes(profile.memberID))
          inLeaderboard = false;

        return inLeaderboard;
      })
      .slice(0, 10);

    let str = '';

    top10.forEach((top, i) => {
      str += `${this.client.users.get(top.memberID).username ||
        '[Left Aldovia Network]'} (${
        leaderboard === 'coins' ? top.coins + ' Coins' : top.reputation + '%'
      }) ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}\n\n`;
    });

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(
          leaderboard === 'coins'
            ? 'Top 10 Richest members of Aldovia Network'
            : 'Top 10 most reputable members of Aldovia'
        )
        .setDescription(str)
        .setColor('#2196f3')
    );
  }
***REMOVED***
