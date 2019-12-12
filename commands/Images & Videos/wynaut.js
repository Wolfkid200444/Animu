const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['why-not'],
      requiredPermissions: ['ATTACH_FILES'],
      cooldown: 10,
      description: 'Wynaut? (Seriously? Why not?)',
    });
  }

  async run(msg) {
    msg.send({
      files: [`${__dirname}/../../images/wynaut.png`],
    });
  }
***REMOVED***
