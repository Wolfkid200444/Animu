const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      cooldown: 10,
      description: 'Calculate age',
      usage: '<year:int>',
    });
  }

  async run(msg, [year]) {
    const currentYear = new Date().getFullYear();
    return msg.send(
      `Someone born in ${year} would be ${currentYear - year} years old.`,
    );
  }
***REMOVED***
