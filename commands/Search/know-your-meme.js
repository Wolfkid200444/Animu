const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const { shorten } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get info about a meme',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<query:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [query]) {
    const location = await this.search(query);
    if (!location) return msg.say('Could not find any results.');
    const data = await this.fetchMeme(location);
    const embed = new MessageEmbed()
      .setColor(0x12133f)
      .setAuthor(
        'Know Your Meme',
        'https://i.imgur.com/WvcH4Z2.png',
        'https://knowyourmeme.com/',
      )
      .setTitle(data.name)
      .setDescription(shorten(data.description || 'No description available.'))
      .setURL(data.url)
      .setThumbnail(data.thumbnail);
    return msg.send(embed);
  }

  async search(query) {
    const { data: text } = await axios.get('https://knowyourmeme.com/search', {
      params: { q: query },
    });
    const $ = cheerio.load(text);
    const location = $('.entry-grid-body')
      .find('tr td a')
      .first()
      .attr('href');
    if (!location) return null;
    return location;
  }

  async fetchMeme(location) {
    const { data: text } = await axios.get(
      `https://knowyourmeme.com${location}`,
    );
    const $ = cheerio.load(text);
    const thumbnail =
      $('a[class="photo left wide"]')
        .first()
        .attr('href') ||
      $('a[class="photo left "]')
        .first()
        .attr('href') ||
      null;
    return {
      name: $('h1')
        .first()
        .text()
        .trim(),
      url: `https://knowyourmeme.com${location}`,
      description: this.getMemeDescription($),
      thumbnail,
    ***REMOVED***
  }

  getMemeDescription($) {
    const children = $('.bodycopy')
      .first()
      .children();
    let foundAbout = false;
    for (let i = 0; i < children.length; i++) {
      const text = children.eq(i).text();
      if (foundAbout) {
        if (text) return text;
      } else if (text === 'About') {
        foundAbout = true;
      }
    }
    return null;
  }
***REMOVED***
