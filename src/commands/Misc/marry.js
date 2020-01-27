const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const prompt = require('discordjs-prompter');

//Init
const Profile = mongoose.model('Profile');
const Inventory = mongoose.model('Inventory');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['marriage', 'wed', 'propose'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 60,
      description: 'Marry someone',
      extendedHelp:
        'Marry someone! Tho you need the Marriage Ring to marry anyone, and if you get rejected you will lose your ring',
      usage: '<member:member>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [member]) {
    const aldovia = this.client.guilds.get('556442896719544320');

    const profile = await Profile.findOne({
      memberID: msg.member.id,
    }).exec();

    const profileToMarry = await Profile.findOne({
      memberID: member.id,
    }).exec();

    if (msg.member.id === member.id)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle("Can't marry yourself")
          .setDescription('You did an oopsie!')
          .setColor('#f44336'),
      );

    if (!profile)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Profile not found')
          .setDescription('Use `-register` to register your profile')
          .setColor('#f44336'),
      );

    if (!profileToMarry)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "The person you're trying to marry doesn't have a profile, they have to use `-register` command to register their profile",
          )
          .setColor('#f44336'),
      );

    if (profile.marriedTo !== '' || profileToMarry.marriedTo !== '')
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Already married')
          .setDescription(
            "You or the person you're trying to marry is already married",
          )
          .setColor('#f44336'),
      );

    if (
      !(await msg.hasAtLeastPermissionLevel(8)) ||
      aldovia.members
        .get(profile.memberID)
        .roles.find((r) => r.name === 'Moderator')
    ) {
      const inventory = await Inventory.findOne({
        memberID: msg.member.id,
      }).exec();

      const index = inventory.inventory.indexOf('Marriage Ring');

      if (index < 0)
        return msg.sendEmbed(
          new MessageEmbed()
            .setTitle('Marriage Ring not found')
            .setDescription(
              'You need a `Marriage Ring` in your inventory to marry someone',
            )
            .setColor('#f44336'),
        );

      inventory.inventory.splice(index, 1);
      await inventory.save();
    }

    const res = await prompt.reaction(msg.channel, {
      question: `${member}, Do you accept ${msg.member.displayName}'s proposal to marry you?`,
      userId: member.id,
    });

    if (!res || res === 'no')
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Rejected')
          .setDescription(`Big Oof for you, ${msg.member.displayName}`)
          .setColor('#f44336'),
      );

    profile.marriedTo = member.id;
    profileToMarry.marriedTo = msg.member.id;

    await profile.save();
    await profileToMarry.save();

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle("You're married now!🎉")
        .setDescription(
          `${msg.member.displayName} married ${member.displayName} 🎉🎉🎉`,
        )
        .setColor('#2196f3'),
    );
  }
};
