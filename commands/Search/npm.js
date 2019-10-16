const { Command } = require('klasa');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { trimArray } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['nasa-image', 'search-nasa'],
      description: 'Search NASA archives for an image',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<pkg:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [pkg]) {
    pkg = encodeURIComponent(pkg.replace(/ /g, '-'));
    const { data: body } = await axios.get(`https://registry.npmjs.com/${pkg}`);
    if (body.time.unpublished) return msg.send('This package no longer exists.');
    const version = body.versions[body['dist-tags'].latest];
    const maintainers = trimArray(body.maintainers.map((user) => user.name));
    const dependencies = version.dependencies
      ? trimArray(Object.keys(version.dependencies))
      : null;
    const embed = new MessageEmbed()
      .setColor(0xcb0000)
      .setAuthor(
        'NPM',
        'https://i.imgur.com/ErKf5Y0.png',
        'https://www.npmjs.com/',
      )
      .setTitle(body.name)
      .setURL(`https://www.npmjs.com/package/${pkg}`)
      .setDescription(body.description || 'No description.')
      .addField('❯ Version', body['dist-tags'].latest, true)
      .addField('❯ License', body.license || 'None', true)
      .addField('❯ Author', body.author ? body.author.name : '???', true)
      .addField(
        '❯ Creation Date',
        moment.utc(body.time.created).format('MM/DD/YYYY h:mm A'),
        true,
      )
      .addField(
        '❯ Modification Date',
        moment.utc(body.time.modified).format('MM/DD/YYYY h:mm A'),
        true,
      )
      .addField('❯ Main File', version.main || 'index.js', true)
      .addField(
        '❯ Dependencies',
        dependencies && dependencies.length ? dependencies.join(', ') : 'None',
      )
      .addField('❯ Maintainers', maintainers.join(', '));
    return msg.send(embed);
  }
***REMOVED***
