const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');
const Guild = mongoose.model('Guild');
const Key = mongoose.model('Key');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['vcbanner', 'vchangeb', 'vcb'],
      requiredPermissions: ['MANAGE_GUILD', 'EMBED_LINKS'],
      cooldown: 60,
      description: 'Change Server Banner (Verified members only)',
      extendedHelp:
        'You can only change server banner once per 30 days. Please note that the image must be at least 1920x1080',
      usage: '<bannerURL:string>',
    });
  }

  async run(msg, [bannerURL]) {
    const guild = await Guild.findOne({ guildID: msg.guild.id }).exec();
    const key = await Key.findOne({ key: guild.key }).exec();

    if (key === 'lite') return;

    if (!msg.guild.settings.verifiedRole)
      return msg.sendEmbed(
        new MessageEmbed({
          title: 'No verified Role',
          description: "This guild doesn't have a verified role set up",
          color: '#f44336',
        }),
      );

    if (msg.guild.premiumTier < 2)
      return msg.sendEmbed(
        new MessageEmbed({
          title: 'Not enough boosts',
          description: "This guild hasn't yet unlocked guild banner",
          color: '#f44336',
        }),
      );

    if (!msg.member.roles.has(msg.guild.settings.verifiedRole))
      return msg.sendEmbed(
        new MessageEmbed({
          title: 'Not verified',
          description: 'You must be a verified member to use this command',
          color: '#f44336',
        }),
      );

    const profile = await Profile.findOne({ memberID: msg.author.id }).exec();

    const lastChangedRaw = profile.lastBannerChange.find(
      (guild) => guild.guildID === msg.guild.id,
    );

    let lastChanged = 30;

    if (lastChangedRaw) lastChanged = lastChangedRaw.daysAgo;

    if (lastChanged < 30)
      return msg.sendEmbed(
        new MessageEmbed({
          title: 'On Cooldown',
          description: `You can only change banner once per 30 days, you last changed banner **${lastChanged}** days ago, you can change it again in **${30 -
            lastChanged}** days`,
          color: '#f44336',
        }),
      );

    //Change Banner
    msg.guild.setBanner(bannerURL, 'Verified member perk');

    //Save changes to Databse
    if (lastChangedRaw)
      profile.lastBannerChange.find(
        (guild) => guild.guildID === msg.guild.id,
      ).daysAgo = 0;
    else profile.lastBannerChange.push({ guildID: msg.guild.id, daysAgo: 0 });

    await profile.save();

    //Send success message
    return msg.sendEmbed(
      new MessageEmbed({
        title: 'Banner Changed',
        description: `Banner of ${msg.guild.name} is successfully changed`,
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
