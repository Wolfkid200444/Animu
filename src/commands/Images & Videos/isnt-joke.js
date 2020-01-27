const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['is-not-joke', 'isnot-joke'],
      requiredPermissions: ['ATTACH_FILES'],
      cooldown: 10,
      description: "Nope, that wasn't a joke",
    });
  }

  async run(msg) {
    msg.send({
      files: [`${__dirname}/../../../assets/images/isnt-joke.png`],
    });
  }
};
