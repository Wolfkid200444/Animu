const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { formatNumber } = require('../../util/util');
const { OSUAPIKey } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      description: 'Get info on a OSU User',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<user:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [user]) {
    const { data: body } = await axios.get('https://osu.ppy.sh/api/get_user', {
      params: {
        k: OSUAPIKey,
        u: user,
        type: 'string',
      },
    });
    if (!body.length) return msg.say('Could not find any results.');
    const data = body[0];
    const embed = new MessageEmbed()
      .setColor(0xff66aa)
      .setAuthor(
        'osu!',
        'https://i.imgur.com/hWrw2Sv.png',
        'https://osu.ppy.sh/',
      )
      .addField('❯ Username', data.username, true)
      .addField('❯ ID', data.user_id, true)
      .addField('❯ Level', data.level || '???', true)
      .addField(
        '❯ Accuracy',
        data.accuracy ? `${Math.round(data.accuracy)}%` : '???',
        true,
      )
      .addField(
        '❯ Rank',
        data.pp_rank ? formatNumber(data.pp_rank) : '???',
        true,
      )
      .addField(
        '❯ Play Count',
        data.playcount ? formatNumber(data.playcount) : '???',
        true,
      )
      .addField('❯ Country', data.country || '???', true)
      .addField(
        '❯ Ranked Score',
        data.ranked_score ? formatNumber(data.ranked_score) : '???',
        true,
      )
      .addField(
        '❯ Total Score',
        data.total_score ? formatNumber(data.total_score) : '???',
        true,
      )
      .addField(
        '❯ SS',
        data.count_rank_ss ? formatNumber(data.count_rank_ss) : '???',
        true,
      )
      .addField(
        '❯ S',
        data.count_rank_s ? formatNumber(data.count_rank_s) : '???',
        true,
      )
      .addField(
        '❯ A',
        data.count_rank_a ? formatNumber(data.count_rank_a) : '???',
        true,
      );
    return msg.send(embed);
  }
***REMOVED***
