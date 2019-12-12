const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const { drawImageWithTint } = require('../../util/Canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      cooldown: 10,
      description: 'Show your love',
      usage: '<user:member>',
    });
  }

  async run(msg, [user]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'hearts.png')
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(avatar.width, avatar.height);
      const ctx = canvas.getContext('2d');
      drawImageWithTint(
        ctx,
        avatar,
        'deeppink',
        0,
        0,
        avatar.width,
        avatar.height
      );
      ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: 'hearts.png' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
