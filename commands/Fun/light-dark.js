const { Command } = require('klasa');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['dark-light'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: "Whether you're using light theme or dark theme?",
    });
  }

  async run(msg) {
    const meme = _.sample(['default', 'moth']);

    msg.send({
      files: [`${__dirname}/../../images/${meme}.png`],
    });
  }
***REMOVED***
