const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Discover new manga (or doujins)',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<mangaName:...string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [mangaName]) {
    const res = await axios.get('https://api.jikan.moe/v3/search/manga/', {
      params: {
        q: mangaName,
        page: 1,
        limit: 1,
      },
    });

    const manga = res.data.results[0];

    msg.sendEmbed(
      new MessageEmbed()
        .setThumbnail(manga.image_url)
        .setColor('#2196f3')
        .addField('❯ Name', manga.title, true)
        .addField('❯ Type', manga.type, true)
        .addField('❯ Description', manga.synopsis)
        .addField('❯ chapters', manga.chapters, true)
        .addField('❯ Score', manga.score, true)
    );
  }
***REMOVED***
