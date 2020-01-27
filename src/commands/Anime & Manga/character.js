const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { trimArray } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'View details about your waifus (or other characters)',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<characterName:...string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [characterName]) {
    const res = await axios.get('https://api.jikan.moe/v3/search/character/', {
      params: {
        q: characterName,
        page: 1,
        limit: 1,
      },
    });

    const character = res.data.results[0];

    msg.sendEmbed(
      new MessageEmbed()
        .setThumbnail(character.image_url)
        .setColor('#2196f3')
        .addField('❯ Name', character.name, true)
        .addField(
          '❯ Anime',
          character.anime.length > 0
            ? trimArray(
                character.anime.map(anime => anime.name),
                10
              ).join(', ')
            : '[None Found]',
          true
        )
        .addField(
          '❯ Manga',
          character.manga.length > 0
            ? trimArray(
                character.manga.map(manga => manga.name),
                10
              ).join(', ')
            : '[None Found]',
          true
        )
        .addField('❯ MAL ID', character.mal_id, true)
    );
  }
};
