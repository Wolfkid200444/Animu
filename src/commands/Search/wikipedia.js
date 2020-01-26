const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { shorten } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Search wikipedia',
      aliases: ['wiki'],
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<query:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [query]) {
    const { data: body } = await axios.get(
      'https://en.wikipedia.org/w/api.php',
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
      .setColor(0xe7e7e7)
      .setTitle(data.title)
      .setAuthor(
        'Wikipedia',
        'https://i.imgur.com/Z7NJBK2.png',
        'https://www.wikipedia.org/'
      )
      .setThumbnail(data.thumbnail ? data.thumbnail.source : null)
      .setURL(
        `https://en.wikipedia.org/wiki/${encodeURIComponent(query).replace(
          /\)/g,
          '%29'
        )}`
      )
      .setDescription(shorten(data.extract.replace(/\n/g, '\n\n')));
    return msg.send(embed);
  }
***REMOVED***
