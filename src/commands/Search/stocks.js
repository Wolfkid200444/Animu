const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { formatNumber } = require('../../util/util');
const { alphaVantageAPIKey } = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Get current stocks for a symbol',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<symbol:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [symbol]) {
    const { data: body } = await axios.get(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol,
          interval: '1min',
          apikey: alphaVantageAPIKey,
        },
      }
    );
    if (body['Error Message']) return msg.send('Could not find any results.');
    const data = Object.values(body['Time Series (1min)'])[0];
    const embed = new MessageEmbed()
      .setTitle(`Stocks for ${symbol.toUpperCase()}`)
      .setColor(0x9797ff)
      .setFooter('Last Updated')
      .setTimestamp(new Date(body['Meta Data']['3. Last Refreshed']))
      .addField('❯ Open', `$${formatNumber(data['1. open'])}`, true)
      .addField('❯ Close', `$${formatNumber(data['4. close'])}`, true)
      .addField('❯ Volume', formatNumber(data['5. volume']), true)
      .addField('❯ High', `$${formatNumber(data['2. high'])}`, true)
      .addField('❯ Low', `$${formatNumber(data['3. low'])}`, true)
      .addBlankField(true);
    return msg.send(embed);
  }
};
