const { Command } = require('klasa');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Search Wikihow',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage: '<query:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [query]) {
    const { data: body } = await axios.get('https://www.wikihow.com/api.php', {
      params: {
        action: 'query',
        prop: 'info',
        format: 'json',
        titles: query,
        inprop: 'url',
        redirects: '',
      },
    });
    const data = body.query.pages[Object.keys(body.query.pages)[0]];
    if (data.missing === '') return msg.send('Could not find any results.');
    return msg.send(`How to ${data.title}\n${data.fullurl}`);
  }
};
