const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { shorten } = require('../../util/util');
const { TMBDAPIKey } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['tmdb', 'imdb', 'tmdb-movie'],
      description: 'Get details about a movie',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<query:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [query]) {
    const search = await axios.get('http://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: TMBDAPIKey,
        include_adult: msg.channel.nsfw || false,
        query,
      },
    });
    if (!search.data.results.length)
      return msg.send('Could not find any results.');

    const {
      data: body,
    } = await axios.get(
      `https://api.themoviedb.org/3/movie/${search.data.results[0].id}`,
      { params: { api_key: TMBDAPIKey } }
    );
    const embed = new MessageEmbed()
      .setColor(0x00d474)
      .setTitle(body.title)
      .setURL(`https://www.themoviedb.org/movie/${body.id}`)
      .setAuthor(
        'TMDB',
        'https://i.imgur.com/3K3QMv9.png',
        'https://www.themoviedb.org/'
      )
      .setDescription(
        body.overview ? shorten(body.overview) : 'No description available.'
      )
      .setThumbnail(
        body.poster_path
          ? `https://image.tmdb.org/t/p/w500${body.poster_path}`
          : null
      )
      .addField(
        '❯ Runtime',
        body.runtime ? `${body.runtime} mins.` : '???',
        true
      )
      .addField('❯ Release Date', body.release_date || '???', true)
      .addField(
        '❯ Genres',
        body.genres.length
          ? body.genres.map(genre => genre.name).join(', ')
          : '???'
      )
      .addField(
        '❯ Production Companies',
        body.production_companies.length
          ? body.production_companies.map(c => c.name).join(', ')
          : '???'
      );
    return msg.send(embed);
  }
***REMOVED***
