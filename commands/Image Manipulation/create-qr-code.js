const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      cooldown: 10,
      description: 'Convert text to QR Code',
      usage: '<text:string>',
    });
  }

  async run(msg, [text]) {
    return msg.send({
      files: [
        {
          attachment: `http://api.qrserver.com/v1/create-qr-code/?data=${text}`,
          name: 'qr-code.png',
        },
      ],
    });
  }
***REMOVED***
