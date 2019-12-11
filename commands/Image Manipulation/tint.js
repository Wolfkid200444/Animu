const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const { drawImageWithTint } = require('../../util/Canvas');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: "Draw a tint over a user's avatar",
      usage: '<user:member> <color:string>',
      usageDelim: ' ',
    });
  }

  async run(msg, [user, color]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const data = await loadImage(image);
      const canvas = createCanvas(data.width, data.height);
      const ctx = canvas.getContext('2d');
      drawImageWithTint(ctx, data, color, 0, 0, data.width, data.height);
      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e6)
        return msg.reply('Resulting image was above 8 MB.');
      return msg.send({ files: [{ attachment, name: 'tint.png' }] });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
