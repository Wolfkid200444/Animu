const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { shorten } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Search Bulbapedia about something',
      usage: '<query:string>',
    });
  }

  async run(msg, [query]) {
    const { data: body } = await axios.get(
      'https://bulbapedia.bulbagarden.net/w/api.php',
      {
        params: {
          action: 'query',
          prop: 'extracts|pageimages',
          format: 'json',
          titles: query,
          exintro: '',
          explaintext: '',
          pithumbsize: 150,
          redirects: '',
          formatversion: 2,
        },
      }
    );
    const data = body.query.pages[0];
    if (data.missing) return msg.send('Could not find any results.');
    const embed = new MessageEmbed()
      .setColor(0x3e7614)
      .setTitle(data.title)
      .setAuthor(
        'Bulbapedia',
        'https://i.imgur.com/ePpoeFA.png',
        'https://bulbapedia.bulbagarden.net/'
      )
      .setThumbnail(data.thumbnail ? data.thumbnail.source : null)
      .setURL(
        `https://bulbapedia.bulbagarden.net/wiki/${encodeURIComponent(
          query
        ).replace(/\)/g, '%29')}`
      )
      .setDescription(shorten(data.extract.replace(/\n/g, '\n\n')));
    return msg.send(embed);
  }
***REMOVED***
