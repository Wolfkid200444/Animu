const { Command } = require('klasa');
const axios = require('axios');
const {
  deviantartClientID,
  deviantartClientSecret,
} = require('../../config/keys');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Get an image from deviantart',
      cooldown: 10,
      requiredPermissions: ['EMBED_LINKS'],
      usage:
        '<dailydeviations|hot|newest|popular|undiscovered> [query:...string]',
      usageDelim: ' ',
      quotedStringSupport: true,
    });
    this.token = null;
  }

  async run(msg, [section, query = '']) {
    section = section.toLowerCase();

    if (!this.token) await this.fetchToken();
    const { data: body } = await axios.get(
      `https://www.deviantart.com/api/v1/oauth2/browse/${section}`,
      {
        params: {
          q: query,
          limit: 10,
          access_token: this.token,
          mature_content: msg.channel.nsfw || false,
        },
      }
    );

    const images = body.results.filter(
      image => image.content && image.content.src
    );

    if (!images.length) return msg.send('Could not find any results.');

    return msg.send(
      images[Math.floor(Math.random() * images.length)].content.src
    );
  }

  async fetchToken() {
    const { data: body } = await axios.get(
      'https://www.deviantart.com/oauth2/token',
      {
        params: {
          grant_type: 'client_credentials',
          client_id: deviantartClientID,
          client_secret: deviantartClientSecret,
        },
      }
    );
    this.token = body.access_token;
    setTimeout(() => {
      this.token = null;
    }, body.expires_in * 1000);
    return body;
  }
***REMOVED***
