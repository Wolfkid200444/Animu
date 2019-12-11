const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const { drawImageWithTint } = require('../../util/Canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description:
        "Draw a user's avatar over Simba from The Lion King's reflection",
      usage: '<user:member>',
    });
  }

  async run(msg, [user]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'he-lives-in-you.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(base, 0, 0);
      ctx.rotate(-24 * (Math.PI / 180));
      drawImageWithTint(ctx, avatar, '#00115d', 75, 160, 130, 150);
      ctx.rotate(24 * (Math.PI / 180));
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'he-lives-in-you.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
