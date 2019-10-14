const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { shorten } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: "What's your superpower gonna be?",
    });
  }

  async run(msg) {
    const id = await this.random();
    const article = await this.fetchSuperpower(id);

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`Your superpower is... **${article.title}**!`)
        .setDescription(
          shorten(
            article.content.map((section) => section.text).join('\n\n'),
            1950,
          ),
        )
        .setColor('#2196f3'),
    );
  }

  async random() {
    const { data } = await axios.get('http://powerlisting.wikia.com/api.php', {
      params: {
        action: 'query',
        list: 'random',
        rnnamespace: 0,
        rnlimit: 1,
        format: 'json',
        formatversion: 2,
      },
    });
    return data.query.random[0].id;
  }

  async fetchSuperpower(id) {
    const { data } = await axios.get(
      'http://powerlisting.wikia.com/api/v1/Articles/AsSimpleJson/',
      { params: { id } },
    );
    return data.sections[0];
  }
***REMOVED***
