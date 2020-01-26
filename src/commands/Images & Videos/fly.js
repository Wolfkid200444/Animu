const { Command } = require('klasa');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['ATTACH_FILES'],
      cooldown: 10,
      description: 'Is that a fly on your screen?',
    });
  }

  async run(msg) {
    const meme = _.sample(['1', '2']);

    msg.send({
      files: [`${__dirname}/../../../assets/images/fly-${meme}.png`],
    });
  }
***REMOVED***
