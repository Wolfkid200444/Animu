const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const _ = require('lodash');
const { websterAPIKey } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Define a word',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<word:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [word]) {
    const {
      data: body,
    } = await axios.get(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`,
      { params: { key: websterAPIKey } }
    );

    if (!body.length) return msg.send('Could not find any results.');

    const data = body[0];

    if (typeof data === 'string')
      return msg.send(`Could not find any results. Did you mean **${data}**?`);

    return msg.send(
      new MessageEmbed({
        title: _.capitalize(word),
        color: 0x2196f3,
      })
        .addField('❯ Definition', data.shortdef[0])
        .setFooter(data.fl)
    );
  }
};
