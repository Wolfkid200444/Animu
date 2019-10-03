const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Guild = mongoose.model('Guild');
const Key = mongoose.model('Key');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 7,
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      description: 'Register your guild',
      usage: '<key:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [key]) {
    const existingGuild = await Guild.findOne({ guildID: msg.guild.id }).exec();

    if (existingGuild)
      return msg.send(
        new MessageEmbed({
          title: 'Already Registered',
          description: 'Your Guild is already registered',
          color: '#f44336',
        }),
      );

    const keyDb = await Key.findOne({ key }).exec();

    if (!keyDb)
      return msg.send(
        new MessageEmbed({
          title: 'Key invalid',
          description: "The key you're trying to use is invalid",
          color: '#f44336',
        }),
      );

    const keyUsed = await Guild.findOne({ key }).exec();

    if (keyUsed)
      return msg.send(
        new MessageEmbed({
          title: 'Key in Use',
          description:
            "The key you're trying to use is already in use by some other guild",
          color: '#f44336',
        }),
      );

    await new Guild({
      guildID: msg.guild.id,
      key,
      levelPerks: [],
    }).save();

    require('../../data/validGuilds').add(msg.guild.id);

    msg.send(
      new MessageEmbed({
        title: 'Registered',
        description:
          'Your guild is succesfully registered, If you encounter any issues shoot us a mail at hi@aldovia.moe',
        color: '#2196f3',
      }),
    );
  }
***REMOVED***
