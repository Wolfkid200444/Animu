const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Discover new anime (or hentai)',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<animeName:...string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [animeName]) {
    const res = await axios.get('https://api.jikan.moe/v3/search/anime/', {
      params: {
        q: animeName,
        page: 1,
        limit: 1,
      },
    });

    const anime = res.data.results[0];

    msg.sendEmbed(
      new MessageEmbed()
        .setThumbnail(anime.image_url)
        .setColor('#2196f3')
        .addField('❯ Name', anime.title, true)
        .addField('❯ Type', anime.type, true)
        .addField('❯ Description', anime.synopsis)
        .addField('❯ Episodes', anime.episodes, true)
        .addField('❯ Score', anime.score, true)
    );
  }
***REMOVED***
