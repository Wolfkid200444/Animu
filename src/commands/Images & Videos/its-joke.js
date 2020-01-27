const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['is-joke'],
      requiredPermissions: ['ATTACH_FILES'],
      cooldown: 10,
      description: "This one's a joke",
    });
  }

  async run(msg) {
    msg.send({
      files: [`${__dirname}/../../../assets/images/its-joke.png`],
    });
  }
};
