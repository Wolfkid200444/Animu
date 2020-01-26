const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['timezone', 'time-zone'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Mr. Worldwide',
      usage: '<timeZone:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [timeZone]) {
    timeZone = timeZone.replace(/ /g, '_').toLowerCase();
    if (!moment.tz.zone(timeZone)) {
      return msg.reply(
        'Invalid time zone. Refer to <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>.'
      );
    }
    const time = moment()
      .tz(timeZone)
      .format('h:mm A');
    const location = timeZone.split('/');
    const main = _.capitalize(location[0], /[_ ]/);
    const sub = location[1] ? _.capitalize(location[1], /[_ ]/) : null;
    const subMain = location[2] ? _.capitalize(location[2], /[_ ]/) : null;
    const parens = sub ? ` (${subMain ? `${sub}, ` : ''}${main})` : '';

    return msg.send(
      new MessageEmbed({
        title: `Time in ${subMain || sub || main}${parens}`,
        description: `The current time in ${subMain ||
          sub ||
          main}${parens} is ${time}`,
        color: 0x2196f3,
      })
    );
  }
***REMOVED***
