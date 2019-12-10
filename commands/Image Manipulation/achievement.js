const { Command } = require('klasa');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { shortenText } = require('../../util/Canvas');

registerFont(path.join(__dirname, '..', '..', 'fonts', 'Minecraftia.ttf'), {
  family: 'Minecraftia',
});

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['minecraft-achievement'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Sends a minecraft achievement with your text',
      usage: '<text:...string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [text]) {
    const base = await loadImage(
      path.join(__dirname, '..', '..', 'images', 'achievement.png')
    );
    const canvas = createCanvas(base.width, base.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(base, 0, 0);
    ctx.font = '17px Minecraftia';
    ctx.fillStyle = '#ffff00';
    ctx.fillText('Achievement Get!', 60, 40);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(shortenText(ctx, text, 230), 60, 60);
    return msg.send({
      files: [{ attachment: canvas.toBuffer(), name: 'achievement.png' }],
    });
  }
***REMOVED***
