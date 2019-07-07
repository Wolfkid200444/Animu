const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const JikanTS = require('jikants').default;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Show details about an anime',
      cooldown: 10,
      extendedHelp:
        'Show details about an anime. The argument provided is anime name',
      usage: '<animeName:...string>',
      quotedStringSupport: true
    });
  }

  async run(msg, [animeName]) {
    const res = await JikanTS.Search.search(animeName, 'anime', 1, {
      limit: 1
    });
    const anime = res.result[0];

    msg.sendEmbed(
      new MessageEmbed()
        .setThumbnail(anime.image_url)
        .setColor('#2196f3')
        .addField('❯ Name', anime.title, true)
        .addField('❯ Type', anime.type, true)
        .addField('❯ Description', anime.description)
        .addField('❯ Episodes', anime.episodes, true)
        .addField('❯ Score', anime.score, true)
    );
  }
***REMOVED***
