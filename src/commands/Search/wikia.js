const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { shorten } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Search a fandom wikia',
      aliases: ['fandom'],
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<wiki:string> <query:...string>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [wiki, query]) {
    wiki = encodeURIComponent(wiki);

    try {
      const { id, url } = await this.search(wiki, query);
      const data = await this.fetchArticle(wiki, id);
      const embed = new MessageEmbed()
        .setColor(0x002d54)
        .setTitle(data.title)
        .setURL(url)
        .setAuthor(
          'Wikia',
          'https://i.imgur.com/15A34JT.png',
          'http://www.wikia.com/fandom'
        )
        .setDescription(
          shorten(data.content.map(section => section.text).join('\n\n'))
        )
        .setThumbnail(data.images.length ? data.images[0].src : null);
      return msg.send(embed);
    } catch (err) {
      if (err.status === 404) return msg.send('Could not find any results');
      return msg.send(
        `Oh no, an error occurred: \`${err.message}\`. Perhaps you entered an invalid wiki?`
      );
    }
  }

  async search(wiki, query) {
    const { data: body } = await axios.get(
      `https://${wiki}.wikia.com/api/v1/Search/List/`,
      {
        params: {
          query,
          limit: 1,
          namespaces: 0,
        },
      }
    );
    const data = body.items[0];
    return { id: data.id, url: data.url };
  }

  async fetchArticle(wiki, id) {
    const {
      data: body,
    } = await axios.get(
      `https://${wiki}.wikia.com/api/v1/Articles/AsSimpleJson/`,
      { params: { id } }
    );
    return body.sections[0];
  }
};
