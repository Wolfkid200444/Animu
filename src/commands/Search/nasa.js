const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { shorten } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['nasa-image', 'search-nasa'],
      description: 'Search NASA archives for an image',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<query:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [query]) {
    const { data: body } = await axios.get(
      'https://images-api.nasa.gov/search',
      {
        params: {
          q: query,
          media_type: 'image',
        },
      }
    );
    const images = body.collection.items;
    if (!images.length) return msg.send('Could not find any results.');
    const data = images[Math.floor(Math.random() * images.length)];
    const embed = new MessageEmbed()
      .setTitle(shorten(data.data[0].title, 256))
      .setDescription(shorten(this.cleanHTML(data.data[0].description)))
      .setColor(0x2e528e)
      .setAuthor(
        'NASA',
        'https://i.imgur.com/Wh8jY9c.png',
        'https://www.nasa.gov/multimedia/imagegallery/index.html'
      )
      .setImage(
        `https://images-assets.nasa.gov/image/${data.data[0].nasa_id}/${data.data[0].nasa_id}~thumb.jpg`
      )
      .setFooter(`Image Credits: ${data.data[0].center || 'Public Domain'}`)
      .setTimestamp(new Date(data.data[0].date_created));

    return msg.send(embed);
  }

  cleanHTML(text) {
    return text
      .replace(/<\/?b>/g, '**')
      .replace(/<\/?i>/g, '*')
      .replace(
        /<a href="(https?:\/\/[^ ]+)" rel="nofollow">([^<>]+)<\/a>/g,
        '[$2]($1)'
      );
  }
};
