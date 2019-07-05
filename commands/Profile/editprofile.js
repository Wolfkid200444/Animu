const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['ep', 'profiledit', 'pedit', 'editp', 'edit'],
      cooldown: 10,
      description: 'Edit profile',
      extendedHelp:
        "Edit your profile, valid keys are 'description', 'favorite anime' and 'profile color'",
      usage: '<description|favoriteAnime|profileColor> <value:string>',
      usageDelim: ' ',
      quotedStringSupport: true
    });
  }

  async run(msg, [key, value]) {
    await msg.author.editProfile(key, value);
    msg.sendEmbed(await msg.author.getProfileEmbed());
  }
***REMOVED***
