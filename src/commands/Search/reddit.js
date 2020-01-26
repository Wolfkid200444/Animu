const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const moment = require('moment');
const { formatNumber } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Get info about a Reddit user',
      cooldown: 10,
      aliases: ['reddit-user', 'u/'],
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<user:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [user]) {
    try {
      const { data: body } = await axios.get(
        `https://www.reddit.com/user/${user}/about.json`
      );
      const { data } = body;
      if (data.hide_from_robots)
        return msg.send('This user is hidden from bots.');
      const embed = new MessageEmbed()
        .setColor(0xff4500)
        .setAuthor(
          'Reddit',
          'https://i.imgur.com/DSBOK0P.png',
          'https://www.reddit.com/'
        )
        .setThumbnail(data.icon_img)
        .setURL(`https://www.reddit.com/user/${user}`)
        .setTitle(`/u/${data.name}`)
        .addField('❯ Username', data.name, true)
        .addField('❯ ID', data.id, true)
        .addField(
          '❯ Karma',
          formatNumber(data.link_karma + data.comment_karma),
          true
        )
        .addField(
          '❯ Creation Date',
          moment.utc(data.created_utc * 1000).format('MM/DD/YYYY h:mm A'),
          true
        )
        .addField('❯ Gold?', data.is_gold ? 'Yes' : 'No', true)
        .addField('❯ Verified?', data.verified ? 'Yes' : 'No', true);
      return msg.send(embed);
    } catch (err) {
      if (err.status === 404) return msg.send('Could not find any results.');
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
