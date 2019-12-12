const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'group'],
      cooldown: 10,
      description: 'Try out some hats',
      usage:
        '<user:member> <birthday|christmas|leprechaun|megumin|pilgrim|pirate|tophat|witch>',
      usageDelim: ' ',
    });
  }

  async run(msg, [user, type]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'images', 'hat', `${type}.png`)
      );
      const avatar = await loadImage(image);
      const canvas = createCanvas(avatar.width, avatar.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(avatar, 0, 0);
      ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
      return msg.send({
        files: [{ attachment: canvas.toBuffer(), name: `${type}-hat.png` }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
***REMOVED***
