const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { shorten, formatNumber } = require('../../util/util');
const { booksAPIKey } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Get info about a book',
      usage: '<query:string>',
    });
  }

  async run(msg, [query]) {
    const { data: body } = await axios.get(
      'https://www.googleapis.com/books/v1/volumes',
      {
        params: {
          apiKey: booksAPIKey,
          q: query,
          maxResults: 1,
          printType: 'books',
        },
      }
    );

    if (!body.items) return msg.send('Could not find any results.');
    const data = body.items[0].volumeInfo;
    const embed = new MessageEmbed()
      .setColor(0x4285f4)
      .setTitle(data.title)
      .setURL(data.previewLink)
      .setAuthor(
        'Google Books',
        'https://i.imgur.com/N3oHABo.png',
        'https://books.google.com/'
      )
      .setDescription(
        data.description
          ? shorten(data.description)
          : 'No description available.'
      )
      .setThumbnail(data.imageLinks ? data.imageLinks.thumbnail : null)
      .addField(
        '❯ Authors',
        data.authors.length ? data.authors.join(', ') : '???'
      )
      .addField('❯ Publish Date', data.publishedDate || '???', true)
      .addField(
        '❯ Page Count',
        data.pageCount ? formatNumber(data.pageCount) : '???',
        true
      );
    return msg.send(embed);
  }
};
