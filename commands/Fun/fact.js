const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'View random fact',
    });
  }

  async run(msg) {
    const article = await this.randomWikipediaArticle();
    const { data } = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        prop: 'extracts',
        format: 'json',
        titles: article,
        exintro: '',
        explaintext: '',
        redirects: '',
        formatversion: 2,
      },
    });

    let fact = data.query.pages[0].extract;

    if (fact.length > 200) {
      const facts = fact.split('.');
      fact = `${facts[0]}.`;
      if (fact.length < 200 && facts.length > 1) fact += `${facts[1]}.`;
    }

    return msg.send(
      new MessageEmbed({
        title: 'Fact',
        description: fact,
        color: 0x2196f3,
      }),
    );
  }

  async randomWikipediaArticle() {
    const { data } = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'random',
        rnnamespace: 0,
        rnlimit: 1,
        format: 'json',
        formatversion: 2,
      },
    });

    if (!data.query.random[0].title) return 'Facts are hard to find sometimes.';
    return data.query.random[0].title;
  }
***REMOVED***
