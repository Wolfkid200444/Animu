const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: "Draw a user's avatar sipping tea",
      usage: '<user:member> [left|right]',
      usageDelim: ' ',
    });
  }

  async run(msg, [user, direction = 'left']) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'sip.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext('2d');
      ctx.fillRect(0, 0, base.width, base.height);
      if (direction === 'right') {
        ctx.translate(base.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(avatar, 0, 0, 512, 512);
      if (direction === 'right') ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(base, 0, 0);
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'sip.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
