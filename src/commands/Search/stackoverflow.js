const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const moment = require('moment');
const { formatNumber } = require('../../util/util');
const { stackoverflowKey } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Search Stackoverflow for you question',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<query:string>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [query]) {
    const { data: body } = await axios.get(
      'http://api.stackexchange.com/2.2/search/advanced',
      {
        params: {
          page: 1,
          pagesize: 1,
          order: 'asc',
          sort: 'relevance',
          answers: 1,
          q: query,
          site: 'stackoverflow',
          key: stackoverflowKey,
        },
      }
    );
    if (!body.items.length) return msg.send('Could not find any results.');
    const data = body.items[0];
    const embed = new MessageEmbed()
      .setColor(0xf48023)
      .setAuthor(
        'Stack Overflow',
        'https://i.imgur.com/P2jAgE3.png',
        'https://stackoverflow.com/'
      )
      .setURL(data.link)
      .setTitle(data.title)
      .addField('❯ ID', data.question_id, true)
      .addField(
        '❯ Asker',
        `[${data.owner.display_name}](${data.owner.link})`,
        true
      )
      .addField('❯ Views', formatNumber(data.view_count), true)
      .addField('❯ Score', formatNumber(data.score), true)
      .addField(
        '❯ Creation Date',
        moment.utc(data.creation_date * 1000).format('MM/DD/YYYY h:mm A'),
        true
      )
      .addField(
        '❯ Last Activity',
        moment.utc(data.last_activity_date * 1000).format('MM/DD/YYYY h:mm A'),
        true
      );
    return msg.send(embed);
  }
***REMOVED***
