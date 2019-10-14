const { Command } = require('klasa');
const { delay } = require('../../util/util.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['fliptable'],
      cooldown: 30,
      description: 'Flip a table',
    });
    this.frames = [
      '(-°□°)-  ┬─┬',
      '(╯°□°)╯    ]',
      '(╯°□°)╯  ︵  ┻━┻',
      '(╯°□°)╯       [',
      '(╯°□°)╯           ┬─┬',
    ];
  }

  async run(msg) {
    const message = await msg.send('(\\\\°□°)\\\\  ┬─┬');
    for (const frame of this.frames) {
      await delay(100);
      await message.edit(frame);
    }
    return message;
  }
***REMOVED***
