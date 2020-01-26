const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const moment = require('moment');
const { shorten, formatNumber, base64 } = require('../../util/util');
const { githubUsername, githubPassword } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Get info on a Github Repo',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<author:string> <repository:...string>',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
  }

  async run(msg, [author, repository]) {
    try {
      const { data: body } = await axios.get(
        `https://api.github.com/repos/${author}/${repository}`,
        {
          headers: {
            Authorization: `Basic ${base64(
              `${githubUsername}:${githubPassword}`
            )}`,
          },
        }
      );
      const embed = new MessageEmbed()
        .setColor(0xffffff)
        .setAuthor(
          'GitHub',
          'https://i.imgur.com/e4HunUm.png',
          'https://github.com/'
        )
        .setTitle(body.full_name)
        .setURL(body.html_url)
        .setDescription(
          body.description ? shorten(body.description) : 'No description.'
        )
        .setThumbnail(body.owner.avatar_url)
        .addField('❯ Stars', formatNumber(body.stargazers_count), true)
        .addField('❯ Forks', formatNumber(body.forks), true)
        .addField('❯ Issues', formatNumber(body.open_issues), true)
        .addField('❯ Language', body.language || '???', true)
        .addField(
          '❯ Creation Date',
          moment.utc(body.created_at).format('MM/DD/YYYY h:mm A'),
          true
        )
        .addField(
          '❯ Modification Date',
          moment.utc(body.updated_at).format('MM/DD/YYYY h:mm A'),
          true
        );
      return msg.send(embed);
    } catch (err) {
      if (err.status === 404) return msg.send('Could not find any results.');
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
