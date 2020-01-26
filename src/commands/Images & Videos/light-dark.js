const { Command } = require('klasa');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['dark-light'],
      requiredPermissions: ['ATTACH_FILES'],
      cooldown: 10,
      description: 'If you use light theme, you have smol pp',
    });
  }

  async run(msg) {
    const meme = _.sample(['1', '2']);

    msg.send({
      files: [`${__dirname}/../../../assets/images/lightdark-${meme}.png`],
    });
  }
***REMOVED***
